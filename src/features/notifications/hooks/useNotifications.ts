
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { addDays, format, parseISO, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'appointment' | 'inventory' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  client?: string;
  avatar?: string;
}

interface NotificationSettings {
  app_appointments: boolean;
  app_cancellations: boolean;
  app_inventory: boolean;
  app_client: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Buscar configurações de notificação do usuário
  const { data: notificationSettings } = useQuery({
    queryKey: ['notification-settings-for-display'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('notification_settings')
        .select('app_appointments, app_cancellations, app_inventory, app_client')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar configurações:', error);
        return null;
      }

      return data || {
        app_appointments: true,
        app_cancellations: true,
        app_inventory: true,
        app_client: true,
      };
    },
  });

  // Buscar agendamentos próximos
  const { data: appointments } = useQuery({
    queryKey: ['upcoming-appointments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const tomorrow = addDays(new Date(), 1);
      
      // RLS gerencia acesso aos dados do usuário
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (
            name,
            phone
          )
        `)
        .gte('start_time', new Date().toISOString())
        .lte('start_time', tomorrow.toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return [];
      }

      return data || [];
    },
  });

  // Buscar produtos com estoque baixo (stock <= threshold)
  const { data: lowStockProducts } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Buscar todos os produtos que não são serviço - RLS gerencia acesso
      const { data, error } = await supabase
        .from('inventory')
        .select('id, name, stock, threshold')
        .eq('is_service', false)
        .order('stock', { ascending: true });

      if (error) {
        console.error('Erro ao buscar produtos com estoque baixo:', error);
        return [];
      }

      // Filtrar produtos onde stock <= threshold
      return (data || []).filter(product => product.stock <= product.threshold);
    },
  });

  // Gerar notificações baseadas nos dados reais e preferências
  useEffect(() => {
    const generatedNotifications: Notification[] = [];
    const settings = notificationSettings as NotificationSettings | null;

    // Notificações de agendamentos (se habilitado)
    if (settings?.app_appointments !== false && appointments && appointments.length > 0) {
      appointments.forEach((appointment) => {
        const appointmentDate = parseISO(appointment.start_time);
        const clientName = appointment.clients?.name || 'Cliente não identificado';
        
        let timeText = '';
        if (isToday(appointmentDate)) {
          timeText = `Hoje às ${format(appointmentDate, 'HH:mm')}`;
        } else if (isTomorrow(appointmentDate)) {
          timeText = `Amanhã às ${format(appointmentDate, 'HH:mm')}`;
        } else {
          timeText = format(appointmentDate, "dd/MM 'às' HH:mm", { locale: ptBR });
        }

        generatedNotifications.push({
          id: `appointment-${appointment.id}`,
          type: 'appointment',
          title: 'Agendamento Próximo',
          message: `${appointment.title} com ${clientName}`,
          time: timeText,
          read: false,
          client: clientName,
          avatar: clientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        });
      });
    }

    // Notificações de estoque baixo (se habilitado)
    if (settings?.app_inventory !== false && lowStockProducts && lowStockProducts.length > 0) {
      lowStockProducts.forEach((product) => {
        generatedNotifications.push({
          id: `inventory-${product.id}`,
          type: 'inventory',
          title: 'Estoque Baixo',
          message: `${product.name} - apenas ${product.stock} unidades restantes (limite: ${product.threshold})`,
          time: 'Agora',
          read: false
        });
      });
    }

    // Notificação de sistema exemplo (se não houver outras)
    if (generatedNotifications.length === 0) {
      generatedNotifications.push({
        id: 'system-welcome',
        type: 'system',
        title: 'Bem-vindo ao PiercerHub',
        message: 'Configure suas preferências de notificação nas configurações',
        time: 'Agora',
        read: false
      });
    }

    setNotifications(generatedNotifications);
  }, [appointments, lowStockProducts, notificationSettings]);

  const appointmentNotifs = notifications.filter(n => n.type === 'appointment');
  const inventoryNotifs = notifications.filter(n => n.type === 'inventory');
  const systemNotifs = notifications.filter(n => n.type === 'system');
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return {
    notifications,
    appointmentNotifs,
    inventoryNotifs,
    systemNotifs,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
}

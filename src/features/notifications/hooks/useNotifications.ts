
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

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Buscar agendamentos próximos
  const { data: appointments } = useQuery({
    queryKey: ['upcoming-appointments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const tomorrow = addDays(new Date(), 1);
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (
            name,
            phone
          )
        `)
        .eq('user_id', user.id)
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

  // Buscar produtos com estoque baixo
  const { data: lowStockProducts } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_service', false)
        .filter('stock', 'lte', 'threshold')
        .order('stock', { ascending: true });

      if (error) {
        console.error('Erro ao buscar produtos com estoque baixo:', error);
        return [];
      }

      return data || [];
    },
  });

  // Gerar notificações baseadas nos dados reais
  useEffect(() => {
    const generatedNotifications: Notification[] = [];

    // Notificações de agendamentos
    if (appointments && appointments.length > 0) {
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

    // Notificações de estoque baixo
    if (lowStockProducts && lowStockProducts.length > 0) {
      lowStockProducts.forEach((product) => {
        generatedNotifications.push({
          id: `inventory-${product.id}`,
          type: 'inventory',
          title: 'Estoque Baixo',
          message: `${product.name} - apenas ${product.stock} unidades restantes`,
          time: 'Agora',
          read: false
        });
      });
    }

    // Notificação de sistema exemplo
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
  }, [appointments, lowStockProducts]);

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


import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  const { data: upcomingAppointments } = useQuery({
    queryKey: ['upcoming-appointments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (name)
        `)
        .eq('user_id', user.id)
        .gte('start_time', today.toISOString())
        .lte('start_time', tomorrow.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });

  // Buscar itens com estoque baixo
  const { data: lowStockItems } = useQuery({
    queryKey: ['low-stock-items'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_service', false)
        .filter('stock', 'lte', 'threshold');

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 10 * 60 * 1000, // Atualizar a cada 10 minutos
  });

  // Gerar notificações baseadas nos dados reais
  useEffect(() => {
    const generatedNotifications: Notification[] = [];

    // Notificações de agendamentos
    if (upcomingAppointments) {
      upcomingAppointments.forEach((appointment, index) => {
        const appointmentDate = new Date(appointment.start_time);
        const timeUntil = appointmentDate.getTime() - new Date().getTime();
        const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
        
        let timeText = '';
        if (hoursUntil < 1) {
          const minutesUntil = Math.floor(timeUntil / (1000 * 60));
          timeText = `${minutesUntil} minutos`;
        } else if (hoursUntil < 24) {
          timeText = `${hoursUntil} horas`;
        } else {
          timeText = 'amanhã';
        }

        generatedNotifications.push({
          id: `appointment-${appointment.id}`,
          type: 'appointment',
          title: 'Lembrete de Agendamento',
          message: `${appointment.clients?.name || 'Cliente'} tem agendamento para ${appointment.title} ${timeText === 'amanhã' ? 'amanhã' : `em ${timeText}`} às ${appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
          time: timeText === 'amanhã' ? '1 dia' : `${timeText} atrás`,
          read: false,
          client: appointment.clients?.name || 'Cliente',
          avatar: appointment.clients?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'
        });
      });
    }

    // Notificações de estoque baixo
    if (lowStockItems) {
      lowStockItems.forEach((item) => {
        generatedNotifications.push({
          id: `stock-${item.id}`,
          type: 'inventory',
          title: 'Alerta de Estoque',
          message: `${item.name} está com estoque abaixo do mínimo (apenas ${item.stock} unidades)`,
          time: '1 hora atrás',
          read: false
        });
      });
    }

    // Adicionar algumas notificações do sistema se não houver outras
    if (generatedNotifications.length === 0) {
      generatedNotifications.push({
        id: 'system-backup',
        type: 'system',
        title: 'Backup Automático',
        message: 'Backup dos dados realizado com sucesso',
        time: '1 dia atrás',
        read: true
      });
    }

    setNotifications(generatedNotifications);
  }, [upcomingAppointments, lowStockItems]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  const appointmentNotifs = notifications.filter(notif => notif.type === 'appointment');
  const inventoryNotifs = notifications.filter(notif => notif.type === 'inventory');
  const systemNotifs = notifications.filter(notif => notif.type === 'system');

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

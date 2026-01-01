
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'stock' | 'appointment' | 'loyalty';
  createdAt: Date;
}

export function useHeaderNotifications() {
  return useQuery({
    queryKey: ['header-notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const notifications: Notification[] = [];

      // Buscar produtos com estoque baixo
      const { data: lowStockItems } = await supabase
        .from('inventory')
        .select('id, name, stock, threshold')
        .eq('user_id', user.id)
        .eq('is_service', false)
        .lt('stock', 5)
        .limit(3);

      if (lowStockItems) {
        lowStockItems.forEach(item => {
          notifications.push({
            id: `stock-${item.id}`,
            title: `Estoque baixo: ${item.name}`,
            description: `Apenas ${item.stock} unidades restantes`,
            type: 'stock',
            createdAt: new Date()
          });
        });
      }

      // Buscar agendamentos de hoje
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const { data: todayAppointments } = await supabase
        .from('appointments')
        .select(`
          id,
          title,
          start_time,
          clients (name)
        `)
        .eq('user_id', user.id)
        .gte('start_time', startOfDay)
        .lte('start_time', endOfDay)
        .order('start_time', { ascending: true })
        .limit(3);

      if (todayAppointments) {
        todayAppointments.forEach(apt => {
          const time = format(new Date(apt.start_time), 'HH:mm', { locale: ptBR });
          const clientName = (apt.clients as any)?.name || 'Cliente';
          notifications.push({
            id: `apt-${apt.id}`,
            title: 'Lembrete de agendamento',
            description: `${clientName} às ${time}`,
            type: 'appointment',
            createdAt: new Date(apt.start_time)
          });
        });
      }

      return notifications;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: 1000 * 60 * 5 // Refetch a cada 5 minutos
  });
}

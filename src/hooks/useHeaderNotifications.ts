import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays } from 'date-fns';
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

      // Buscar configurações de notificação do usuário
      const { data: settings } = await supabase
        .from('notification_settings')
        .select('app_appointments, app_inventory')
        .eq('user_id', user.id)
        .single();

      const appAppointments = settings?.app_appointments !== false;
      const appInventory = settings?.app_inventory !== false;

      const notifications: Notification[] = [];

      // Buscar produtos com estoque baixo (stock <= threshold) - mesma lógica da página
      if (appInventory) {
        const { data: allProducts } = await supabase
          .from('inventory')
          .select('id, name, stock, threshold')
          .eq('is_service', false)
          .order('stock', { ascending: true });

        if (allProducts) {
          // Filtrar produtos onde stock <= threshold (mesma lógica de useNotifications)
          const lowStockItems = allProducts.filter(item => item.stock <= item.threshold);
          
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
      }

      // Buscar agendamentos de hoje e amanhã - mesma lógica da página
      if (appAppointments) {
        const tomorrow = addDays(new Date(), 1);

        const { data: upcomingAppointments } = await supabase
          .from('appointments')
          .select(`
            id,
            title,
            start_time,
            clients (name)
          `)
          .gte('start_time', new Date().toISOString())
          .lte('start_time', tomorrow.toISOString())
          .order('start_time', { ascending: true });

        if (upcomingAppointments) {
          upcomingAppointments.forEach(apt => {
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
      }

      return notifications;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: 1000 * 60 * 5 // Refetch a cada 5 minutos
  });
}

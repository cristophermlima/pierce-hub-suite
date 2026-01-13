import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'stock' | 'appointment' | 'loyalty';
  createdAt: Date;
}

export function useHeaderNotifications() {
  const { user, loading } = useAuth();

  return useQuery({
    queryKey: ['header-notifications', user?.id],
    enabled: !loading && !!user,
    queryFn: async () => {
      if (!user) return [];

      // Buscar configurações de notificação do usuário
      const { data: settings, error: settingsError } = await supabase
        .from('notification_settings')
        .select('app_appointments, app_inventory')
        .eq('user_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Erro ao buscar configurações (header):', settingsError);
      }

      const appAppointments = settings?.app_appointments !== false;
      const appInventory = settings?.app_inventory !== false;

      const notifications: Notification[] = [];

      // Buscar produtos com estoque baixo (stock <= threshold) - mesma lógica da página
      if (appInventory) {
        const { data: allProducts, error: productsError } = await supabase
          .from('inventory')
          .select('id, name, stock, threshold')
          .eq('is_service', false)
          .order('stock', { ascending: true });

        if (productsError) {
          console.error('Erro ao buscar estoque baixo (header):', productsError);
        }

        (allProducts || [])
          .filter((item) => item.stock <= item.threshold)
          .forEach((item) => {
            notifications.push({
              id: `stock-${item.id}`,
              title: `Estoque baixo: ${item.name}`,
              description: `Apenas ${item.stock} unidades restantes`,
              type: 'stock',
              createdAt: new Date(),
            });
          });
      }

      // Buscar agendamentos de hoje e amanhã - mesma lógica da página
      if (appAppointments) {
        const tomorrow = addDays(new Date(), 1);

        const { data: upcomingAppointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select(
            `
            id,
            title,
            start_time,
            clients (name)
          `,
          )
          .gte('start_time', new Date().toISOString())
          .lte('start_time', tomorrow.toISOString())
          .order('start_time', { ascending: true });

        if (appointmentsError) {
          console.error('Erro ao buscar agendamentos (header):', appointmentsError);
        }

        (upcomingAppointments || []).forEach((apt) => {
          const time = format(new Date(apt.start_time), 'HH:mm', { locale: ptBR });
          const clientName = (apt.clients as any)?.name || 'Cliente';
          notifications.push({
            id: `apt-${apt.id}`,
            title: 'Lembrete de agendamento',
            description: `${clientName} às ${time}`,
            type: 'appointment',
            createdAt: new Date(apt.start_time),
          });
        });
      }

      return notifications;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: 1000 * 60 * 5, // Refetch a cada 5 minutos
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

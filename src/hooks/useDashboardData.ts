import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function useDashboardData() {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  // Vendas do mês atual - RLS gerencia acesso
  const { data: monthSales } = useQuery({
    queryKey: ['month-sales'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // RLS gerencia acesso - sem filtro de user_id
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());

      if (error) {
        console.error('Erro ao buscar vendas do mês:', error);
        return [];
      }

      return data || [];
    },
  });

  // Agendamentos da semana atual - RLS gerencia acesso
  const { data: weekAppointments } = useQuery({
    queryKey: ['week-appointments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // RLS gerencia acesso - sem filtro de user_id
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (
            name,
            phone
          )
        `)
        .gte('start_time', weekStart.toISOString())
        .lte('start_time', weekEnd.toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos da semana:', error);
        return [];
      }

      return data || [];
    },
  });

  // Produtos com estoque baixo - RLS gerencia acesso
  const { data: lowStockProducts } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // RLS gerencia acesso - sem filtro de user_id
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('is_service', false)
        .lt('stock', 5)
        .order('stock', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Erro ao buscar produtos com estoque baixo:', error);
        return [];
      }

      return data || [];
    },
  });

  // Total de clientes - RLS gerencia acesso
  const { data: totalClients } = useQuery({
    queryKey: ['total-clients'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      // RLS gerencia acesso - sem filtro de user_id
      const { count, error } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Erro ao contar clientes:', error);
        return 0;
      }

      return count || 0;
    },
  });

  // Calcular métricas
  const monthRevenue = monthSales?.reduce((sum, sale) => sum + Number(sale.total), 0) || 0;
  const weekAppointmentsCount = weekAppointments?.length || 0;
  const lowStockCount = lowStockProducts?.length || 0;

  // Dados para gráfico de vendas da semana
  const weekSalesData = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const daySales = monthSales?.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate.toDateString() === date.toDateString();
    }) || [];

    const dayRevenue = daySales.reduce((sum, sale) => sum + Number(sale.total), 0);

    return {
      day: format(date, 'EEE', { locale: ptBR }),
      sales: dayRevenue
    };
  });

  return {
    monthRevenue,
    weekAppointmentsCount,
    lowStockCount,
    totalClientsCount: totalClients || 0,
    weekSalesData,
    weekAppointments: weekAppointments || [],
    lowStockProducts: lowStockProducts || []
  };
}

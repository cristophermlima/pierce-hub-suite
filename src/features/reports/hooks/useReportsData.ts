
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfYear, endOfYear, startOfMonth, endOfMonth, format, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function useReportsData() {
  const currentYear = new Date().getFullYear();
  const yearStart = startOfYear(new Date());
  const yearEnd = endOfYear(new Date());

  // Buscar vendas do ano
  const { data: salesData, refetch: refetchSales } = useQuery({
    queryKey: ['sales-data', currentYear],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      console.log('Buscando vendas para o usuário:', user.id);
      console.log('Período:', yearStart.toISOString(), 'até', yearEnd.toISOString());

      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', yearStart.toISOString())
        .lte('created_at', yearEnd.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar vendas:', error);
        return [];
      }

      console.log('Vendas encontradas:', data?.length || 0, data);
      return data || [];
    },
    // Refetch automaticamente para pegar vendas recentes
    refetchInterval: 30000, // Refetch a cada 30 segundos
    refetchOnWindowFocus: true
  });

  // Buscar agendamentos do ano
  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments-data', currentYear],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', yearStart.toISOString())
        .lte('created_at', yearEnd.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return [];
      }

      return data || [];
    },
  });

  // Buscar clientes
  const { data: clientsData } = useQuery({
    queryKey: ['clients-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        return [];
      }

      return data || [];
    },
  });

  // Buscar itens de venda com produtos
  const { data: saleItemsData } = useQuery({
    queryKey: ['sale-items-data', currentYear],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('sale_items')
        .select(`
          *,
          sales!inner (
            user_id,
            created_at
          ),
          inventory (
            name,
            is_service
          )
        `)
        .eq('sales.user_id', user.id)
        .gte('sales.created_at', yearStart.toISOString())
        .lte('sales.created_at', yearEnd.toISOString());

      if (error) {
        console.error('Erro ao buscar itens de venda:', error);
        return [];
      }

      return data || [];
    },
    refetchInterval: 30000, // Refetch a cada 30 segundos
    refetchOnWindowFocus: true
  });

  // Processar dados de receita por mês
  const revenueData = eachMonthOfInterval({ start: yearStart, end: yearEnd }).map(month => {
    const monthSales = salesData?.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate.getMonth() === month.getMonth() && saleDate.getFullYear() === month.getFullYear();
    }) || [];

    const monthRevenue = monthSales.reduce((sum, sale) => sum + Number(sale.total), 0);

    return {
      mes: format(month, 'MMM', { locale: ptBR }),
      receita: monthRevenue
    };
  });

  // Processar dados de agendamentos por mês
  const appointmentsMonthlyData = eachMonthOfInterval({ start: yearStart, end: yearEnd }).map(month => {
    const monthAppointments = appointmentsData?.filter(appointment => {
      const appointmentDate = new Date(appointment.created_at);
      return appointmentDate.getMonth() === month.getMonth() && appointmentDate.getFullYear() === month.getFullYear();
    }) || [];

    const concluidos = monthAppointments.filter(apt => apt.status === 'completed').length;
    const cancelados = monthAppointments.filter(apt => apt.status === 'cancelled').length;

    return {
      mes: format(month, 'MMM', { locale: ptBR }),
      concluidos,
      cancelados
    };
  });

  // Processar dados de serviços/produtos mais vendidos
  const servicesChartData = saleItemsData?.reduce((acc, item) => {
    const productName = item.inventory?.name || 'Produto não identificado';
    const existing = acc.find(service => service.nome === productName);
    
    if (existing) {
      existing.valor += item.quantity;
    } else {
      acc.push({
        nome: productName,
        valor: item.quantity
      });
    }
    
    return acc;
  }, [] as { nome: string; valor: number }[]) || [];

  // Processar novos clientes por mês
  const newClientsData = eachMonthOfInterval({ start: yearStart, end: yearEnd }).map(month => {
    const monthClients = clientsData?.filter(client => {
      const clientDate = new Date(client.created_at);
      return clientDate.getMonth() === month.getMonth() && clientDate.getFullYear() === month.getFullYear();
    }) || [];

    return {
      mes: format(month, 'MMM', { locale: ptBR }),
      clientes: monthClients.length
    };
  });

  // Calcular totais
  const totalRevenue = salesData?.reduce((sum, sale) => sum + Number(sale.total), 0) || 0;
  const totalAppointments = appointmentsData?.length || 0;
  const totalClients = clientsData?.length || 0;
  const completedAppointments = appointmentsData?.filter(apt => apt.status === 'completed').length || 0;
  const cancelledAppointments = appointmentsData?.filter(apt => apt.status === 'cancelled').length || 0;
  
  const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;
  const cancellationRate = totalAppointments > 0 ? Math.round((cancelledAppointments / totalAppointments) * 100) : 0;

  return {
    revenueData,
    appointmentsMonthlyData,
    servicesChartData,
    newClientsData,
    totalRevenue,
    totalAppointments,
    totalClients,
    completionRate,
    cancellationRate,
    refetchSales // Exponha a função de refetch para uso manual se necessário
  };
}

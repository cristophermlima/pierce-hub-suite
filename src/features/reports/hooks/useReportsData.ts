
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfYear, endOfYear, format } from 'date-fns';

export function useReportsData() {
  // Buscar vendas do ano atual
  const { data: salesData = [] } = useQuery({
    queryKey: ['sales-reports'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const currentYear = new Date().getFullYear();
      const yearStart = startOfYear(new Date(currentYear, 0, 1));
      const yearEnd = endOfYear(new Date(currentYear, 11, 31));

      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            quantity,
            price,
            inventory (name, is_service)
          )
        `)
        .eq('user_id', user.id)
        .gte('created_at', yearStart.toISOString())
        .lte('created_at', yearEnd.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Buscar agendamentos do ano atual
  const { data: appointmentsData = [] } = useQuery({
    queryKey: ['appointments-reports'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const currentYear = new Date().getFullYear();
      const yearStart = startOfYear(new Date(currentYear, 0, 1));
      const yearEnd = endOfYear(new Date(currentYear, 11, 31));

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', yearStart.toISOString())
        .lte('start_time', yearEnd.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Buscar clientes
  const { data: clientsData = [] } = useQuery({
    queryKey: ['clients-reports'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Processar dados de receita por mês
  const revenueData = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const monthSales = salesData.filter(sale => {
      const saleMonth = new Date(sale.created_at).getMonth() + 1;
      return saleMonth === month;
    });
    
    const revenue = monthSales.reduce((total, sale) => total + Number(sale.total), 0);
    
    return {
      mes: format(new Date(2024, index, 1), 'MMM'),
      receita: revenue
    };
  });

  // Processar dados de agendamentos por mês
  const appointmentsMonthlyData = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const monthAppointments = appointmentsData.filter(appointment => {
      const appointmentMonth = new Date(appointment.start_time).getMonth() + 1;
      return appointmentMonth === month;
    });
    
    const scheduled = monthAppointments.length;
    const completed = monthAppointments.filter(apt => apt.status === 'completed').length;
    const cancelled = monthAppointments.filter(apt => apt.status === 'cancelled').length;
    
    return {
      mes: format(new Date(2024, index, 1), 'MMM'),
      agendados: scheduled,
      concluidos: completed,
      cancelados: cancelled
    };
  });

  // Processar dados de serviços
  const servicesData = salesData.reduce((acc, sale) => {
    sale.sale_items?.forEach(item => {
      if (item.inventory?.is_service) {
        const serviceName = item.inventory.name;
        acc[serviceName] = (acc[serviceName] || 0) + item.quantity;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const servicesChartData = Object.entries(servicesData).map(([name, value]) => ({
    nome: name,
    valor: value
  }));

  // Processar dados de novos clientes por trimestre
  const newClientsData = Array.from({ length: 4 }, (_, index) => {
    const quarterStart = index * 3;
    const quarterEnd = quarterStart + 2;
    
    const quarterClients = clientsData.filter(client => {
      const clientMonth = new Date(client.created_at).getMonth();
      return clientMonth >= quarterStart && clientMonth <= quarterEnd;
    });
    
    return {
      mes: `Q${index + 1}`,
      clientes: quarterClients.length
    };
  });

  // Calcular totais
  const totalRevenue = salesData.reduce((total, sale) => total + Number(sale.total), 0);
  const totalAppointments = appointmentsData.length;
  const totalClients = clientsData.length;
  const completedAppointments = appointmentsData.filter(apt => apt.status === 'completed').length;
  const cancelledAppointments = appointmentsData.filter(apt => apt.status === 'cancelled').length;

  return {
    revenueData,
    appointmentsMonthlyData,
    servicesChartData,
    newClientsData,
    totalRevenue,
    totalAppointments,
    totalClients,
    completedAppointments,
    cancelledAppointments,
    completionRate: totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0,
    cancellationRate: totalAppointments > 0 ? Math.round((cancelledAppointments / totalAppointments) * 100) : 0
  };
}

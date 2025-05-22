
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ClientOption, AppointmentFormValues } from '../types';

export const useAppointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableClients, setAvailableClients] = useState<ClientOption[]>([]);
  const queryClient = useQueryClient();

  // Fetch clients for the combobox
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, name, phone, email')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          const clientOptions = data.map((client) => ({
            label: client.name,
            value: client.id,
            phone: client.phone,
            email: client.email || '',
          }));
          setAvailableClients(clientOptions);
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        toast.error('Não foi possível carregar a lista de clientes');
      }
    };

    fetchClients();
  }, []);

  // Query to fetch appointments for the selected date
  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['appointments', date ? format(date, 'yyyy-MM-dd') : ''],
    queryFn: async () => {
      if (!date) return [];

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (
            id,
            name
          )
        `)
        .gte('start_time', startOfDay.toISOString())
        .lt('start_time', endOfDay.toISOString())
        .order('start_time');

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        throw new Error('Falha ao carregar agendamentos');
      }

      // Format appointments with client name
      return data.map((appointment: any) => ({
        ...appointment,
        client_name: appointment.clients?.name || 'Cliente não informado',
        client_avatar: appointment.clients?.name.substring(0, 2).toUpperCase() || 'CL',
      }));
    },
    enabled: !!date,
  });

  // Mutation to create appointments
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento criado com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao criar agendamento:', error);
      toast.error('Falha ao criar agendamento');
    }
  });

  // Process form submission
  const handleAppointmentSubmit = async (data: AppointmentFormValues) => {
    try {
      // Format the time to ISO String
      const appointmentDate = data.data;
      const [hours, minutes] = data.hora.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // Calculate end time (1 hour after start)
      const endTime = new Date(appointmentDate);
      endTime.setHours(endTime.getHours() + 1);
      
      // Prepare appointment data
      const appointmentData = {
        title: data.servico,
        description: data.observacoes,
        client_id: data.cliente,
        start_time: appointmentDate.toISOString(),
        end_time: endTime.toISOString(),
        status: 'scheduled'
      };
      
      // Create the appointment
      await createAppointmentMutation.mutateAsync(appointmentData);
      
      // Simulate sending reminders
      if (data.lembrete?.includes('email')) {
        console.log('Enviando lembrete por email para:', data.email);
        toast.info(`Lembrete será enviado para ${data.email}`);
      }
      
      if (data.lembrete?.includes('whatsapp')) {
        console.log('Enviando lembrete por WhatsApp para:', data.telefone);
        toast.info(`Lembrete WhatsApp será enviado para ${data.telefone}`);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao processar agendamento:', error);
      toast.error('Falha ao processar agendamento');
      return false;
    }
  };

  return {
    date,
    setDate,
    availableClients,
    appointmentsData,
    isLoading,
    createAppointmentMutation,
    handleAppointmentSubmit,
  };
};

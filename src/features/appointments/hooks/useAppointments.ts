
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AppointmentFormValues } from '../types';

export const useAppointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();

  // Query to fetch appointments for the selected date
  const { data: appointmentsData = [], isLoading } = useQuery({
    queryKey: ['appointments', date ? format(date, 'yyyy-MM-dd') : ''],
    queryFn: async () => {
      if (!date) return [];

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      try {
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
        return Array.isArray(data) ? data.map((appointment: any) => ({
          ...appointment,
          client_name: appointment.clients?.name || 'Cliente não informado',
          client_avatar: appointment.clients?.name?.substring(0, 2)?.toUpperCase() || 'CL',
        })) : [];
      } catch (error) {
        console.error(error);
        return [];
      }
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
        start_time: appointmentDate.toISOString(),
        end_time: endTime.toISOString(),
        status: 'scheduled',
        // Use the client name directly instead of the client ID
        client_name: data.clientName
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
    appointmentsData,
    isLoading,
    createAppointmentMutation,
    handleAppointmentSubmit,
  };
};

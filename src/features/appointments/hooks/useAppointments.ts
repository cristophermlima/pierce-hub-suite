
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Appointment, AppointmentFormData } from '../types';

export function useAppointments() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    client_id: '',
    status: 'scheduled'
  });

  const queryClient = useQueryClient();

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (
            id,
            name,
            phone,
            email
          )
        `)
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  // Save appointment mutation
  const saveAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Validar dados obrigatórios
      if (!data.title.trim()) {
        throw new Error('Título é obrigatório');
      }
      if (!data.start_time) {
        throw new Error('Data e hora de início são obrigatórias');
      }
      if (!data.end_time) {
        throw new Error('Data e hora de fim são obrigatórias');
      }

      // Verificar se a data de fim é posterior à de início
      if (new Date(data.end_time) <= new Date(data.start_time)) {
        throw new Error('A data de fim deve ser posterior à data de início');
      }

      const appointmentData = {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        start_time: data.start_time,
        end_time: data.end_time,
        client_id: data.client_id || null,
        status: data.status || 'scheduled',
        user_id: user.id
      };

      if (selectedAppointment) {
        // Update existing appointment
        const { data: result, error } = await supabase
          .from('appointments')
          .update(appointmentData)
          .eq('id', selectedAppointment.id)
          .eq('user_id', user.id)
          .select();

        if (error) throw error;
        return result;
      } else {
        // Create new appointment
        const { data: result, error } = await supabase
          .from('appointments')
          .insert(appointmentData)
          .select();

        if (error) throw error;
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success(selectedAppointment ? 'Agendamento atualizado!' : 'Agendamento criado!');
      setIsFormOpen(false);
      setSelectedAppointment(null);
      resetFormData();
    },
    onError: (error: any) => {
      console.error('Erro ao salvar agendamento:', error);
      toast.error(error.message || 'Erro ao salvar agendamento');
    }
  });

  // Delete appointment mutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento excluído!');
    },
    onError: (error: any) => {
      console.error('Erro ao excluir agendamento:', error);
      toast.error('Erro ao excluir agendamento');
    }
  });

  // Reset form data
  const resetFormData = () => {
    setFormData({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      client_id: '',
      status: 'scheduled'
    });
  };

  // Update form data when selecting an appointment
  useEffect(() => {
    if (selectedAppointment) {
      setFormData({
        title: selectedAppointment.title,
        description: selectedAppointment.description || '',
        start_time: selectedAppointment.start_time,
        end_time: selectedAppointment.end_time,
        client_id: selectedAppointment.client_id || '',
        status: selectedAppointment.status
      });
    } else {
      resetFormData();
    }
  }, [selectedAppointment]);

  return {
    appointments,
    isLoading,
    selectedAppointment,
    setSelectedAppointment,
    isFormOpen,
    setIsFormOpen,
    formData,
    setFormData,
    handleSave: (data: AppointmentFormData) => saveAppointmentMutation.mutate(data),
    handleDelete: (appointmentId: string) => deleteAppointmentMutation.mutate(appointmentId),
    isSaving: saveAppointmentMutation.isPending
  };
}

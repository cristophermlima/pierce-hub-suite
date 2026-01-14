import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Appointment, AppointmentFormData } from '../types';
import { getEffectiveUserId } from '@/lib/effectiveUser';

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

      // RLS agora controla o acesso
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
        .order('start_time', { ascending: true });

      if (error) throw error;
      
      // Transform data to match Appointment interface
      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        start_time: item.start_time,
        end_time: item.end_time,
        status: item.status as 'scheduled' | 'completed' | 'canceled',
        client_id: item.client_id,
        client_name: item.clients?.name || 'Cliente',
        client_avatar: item.clients?.name?.charAt(0).toUpperCase() || 'C',
        clients: item.clients
      })) as Appointment[];
    }
  });

  // Save appointment mutation
  const saveAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData & { clientName?: string; telefone?: string; email?: string }) => {
      const effectiveUserId = await getEffectiveUserId();
      const { data: { user } } = await supabase.auth.getUser();

      console.log('💾 Starting save appointment mutation...', data);

      let clientId = data.client_id;

      // Se não tem client_id, criar um novo cliente
      if (!clientId && data.clientName && data.telefone) {
        console.log('👤 Creating new client:', data.clientName);
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            name: data.clientName,
            phone: data.telefone,
            email: data.email || null,
            user_id: effectiveUserId
          })
          .select()
          .single();

        if (clientError) {
          console.error('❌ Error creating client:', clientError);
          throw clientError;
        }

        clientId = newClient.id;
        console.log('✅ Client created with ID:', clientId);
      }

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

      const appointmentData = {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        start_time: data.start_time,
        end_time: data.end_time,
        client_id: clientId || null,
        status: data.status || 'scheduled',
        user_id: effectiveUserId
      };

      let result;

      if (selectedAppointment) {
        // Update existing appointment
        const { data: updated, error } = await supabase
          .from('appointments')
          .update(appointmentData)
          .eq('id', selectedAppointment.id)
          .eq('user_id', user.id)
          .select();

        if (error) throw error;
        result = updated?.[0];
        console.log('✅ Appointment updated successfully');
      } else {
        // Create new appointment
        const { data: created, error } = await supabase
          .from('appointments')
          .insert(appointmentData)
          .select();

        if (error) throw error;
        result = created?.[0];
        console.log('✅ Appointment created successfully:', result);
      }

      // Send notifications only for new appointments
      if (!selectedAppointment && clientId) {
        console.log('📧 Preparando para enviar notificações...');
        try {
          // Get client details from database
          const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('name, email, phone')
            .eq('id', clientId)
            .single();

          if (clientError) {
            console.error('❌ Erro ao buscar cliente:', clientError);
            toast.error('Erro ao buscar dados do cliente');
            return result;
          }

          // Usar EXCLUSIVAMENTE os dados do cliente associados ao agendamento (cadastro)
          const finalEmail = client?.email?.trim();
          const finalPhone = client?.phone?.trim();
          const finalName = client?.name || 'Cliente';

          console.log('👤 Dados para notificação (cadastro do cliente):', {
            name: finalName,
            emailCadastro: client?.email,
            emailFinal: finalEmail,
            telefoneCadastro: client?.phone,
            telefoneFinal: finalPhone,
          });

          // Send notifications if we have email and phone
          if (!finalEmail || !finalPhone) {
            console.warn('⚠️ Sem email ou telefone disponível');
            toast.warning('Sem email ou telefone. Notificações não enviadas.');
            return result;
          }

          console.log('📨 Enviando notificações para:', { email: finalEmail, phone: finalPhone });
          const notificationResponse = await supabase.functions.invoke('send-appointment-notification', {
            body: {
              appointmentId: result.id,
              clientEmail: finalEmail,
              clientPhone: finalPhone,
              clientName: finalName,
              service: data.title,
              startTime: data.start_time,
              endTime: data.end_time,
              location: data.description || undefined,
              userId: user?.id
            }
          });

          if (notificationResponse.error) {
            console.error('❌ Erro ao enviar notificações:', notificationResponse.error);
            toast.error('Erro ao enviar notificações: ' + notificationResponse.error.message);
          } else {
            console.log('✅ Notificações enviadas com sucesso!', notificationResponse.data);
            
            if (notificationResponse.data?.whatsappLink) {
              // Open WhatsApp automatically
              window.open(notificationResponse.data.whatsappLink, '_blank');
              toast.success('Email enviado e WhatsApp aberto!');
            } else {
              toast.success('Email enviado com sucesso!');
            }
          }
        } catch (notificationError) {
          console.error('❌ Erro ao processar notificações:', notificationError);
          toast.error('Erro ao processar notificações');
        }
      } else {
        if (!data.client_id) {
          console.log('⚠️ Agendamento criado sem cliente associado');
        }
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success(selectedAppointment ? 'Agendamento atualizado!' : 'Agendamento criado e notificações enviadas!');
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


import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import { appointmentFormSchema, AppointmentFormValues, Appointment } from '../types';

// Import the form sections
import {
  ClientSection,
  ServiceSection,
  DateTimeSection,
  LocationSection,
  ContactSection,
  ReminderSection,
  NotificationTimeSection,
  NotesSection,
  FormActions
} from './form-sections';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  formData: any;
  setFormData: (data: any) => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const AppointmentForm = ({
  appointment,
  formData,
  setFormData,
  onSave,
  onCancel,
  isSaving
}: AppointmentFormProps) => {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientId: '',
      clientName: '',
      servico: '',
      data: new Date(),
      hora: '',
      localizacao: '',
      telefone: '',
      email: '',
      lembrete: [],
      antecedencia: '30',
      observacoes: '',
    }
  });

  // Função para adicionar 1 hora ao horário
  const addOneHour = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newHours = hours + 1;
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleFormSubmit = async (data: AppointmentFormValues) => {
    console.log('📝 Submitting appointment form:', data);
    
    // Convert form data to the expected format
    const startDateTime = new Date(`${data.data.toISOString().split('T')[0]}T${data.hora}`);
    const endDateTime = new Date(`${data.data.toISOString().split('T')[0]}T${addOneHour(data.hora)}`);
    
    const appointmentData = {
      title: `${data.clientName || 'Cliente'} - ${data.servico}`,
      description: data.observacoes || '',
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      client_id: data.clientId,
      status: 'scheduled' as const
    };
    
    console.log('📤 Sending appointment data:', appointmentData);
    onSave(appointmentData);
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
        </h2>
        <p className="text-sm text-muted-foreground">
          Agende um novo cliente e configure lembretes automáticos.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <ClientSection control={form.control} setValue={form.setValue} />
          <ServiceSection control={form.control} />
          <DateTimeSection control={form.control} />
          <LocationSection control={form.control} />
          <ContactSection control={form.control} />
          <ReminderSection setValue={form.setValue} getValues={form.getValues} />
          <NotificationTimeSection control={form.control} />
          <NotesSection control={form.control} />
          <FormActions onCancel={onCancel} isSubmitting={isSaving} />
        </form>
      </Form>
    </div>
  );
};

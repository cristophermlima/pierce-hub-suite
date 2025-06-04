
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

  const handleFormSubmit = async (data: AppointmentFormValues) => {
    // Convert form data to the expected format
    const appointmentData = {
      title: `${data.clientName} - ${data.servico}`,
      description: data.observacoes || '',
      start_time: new Date(`${data.data.toISOString().split('T')[0]}T${data.hora}`).toISOString(),
      end_time: new Date(`${data.data.toISOString().split('T')[0]}T${data.hora}`).toISOString(),
      client_id: '',
      status: 'scheduled' as const
    };
    
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
          <ClientSection control={form.control} />
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

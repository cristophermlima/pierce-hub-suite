
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { appointmentFormSchema, AppointmentFormValues } from '../types';

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
  onSubmit: (data: AppointmentFormValues) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const AppointmentForm = ({
  onSubmit,
  onCancel,
  isSubmitting
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
    const success = await onSubmit(data);
    if (success) {
      form.reset();
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Novo Agendamento</DialogTitle>
        <DialogDescription>
          Agende um novo cliente e configure lembretes automáticos.
        </DialogDescription>
      </DialogHeader>
      
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
          <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
        </form>
      </Form>
    </>
  );
};

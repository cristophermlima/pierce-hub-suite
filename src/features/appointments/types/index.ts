
import { z } from 'zod';

// Removendo os serviços predefinidos e deixando apenas um campo de texto livre
export const servicosPredefinidos = [];

// Horários disponíveis para o dropdown
export const horariosDisponiveis = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

// Schema para validação do formulário de agendamento
export const appointmentFormSchema = z.object({
  clientName: z.string().min(3, { message: 'Nome do cliente é obrigatório' }),
  servico: z.string().min(1, { message: 'Serviço é obrigatório' }),
  data: z.date({ required_error: 'Data é obrigatória' }),
  hora: z.string().min(1, { message: 'Hora é obrigatória' }),
  localizacao: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  lembrete: z.array(z.string()).optional().default([]),
  antecedencia: z.string().optional(),
  observacoes: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export interface ClientOption {
  label: string;
  value: string;
  phone?: string;
  email?: string;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'canceled';
  client_id?: string;
  client_name?: string;
  client_avatar?: string;
}

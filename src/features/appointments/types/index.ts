
import { z } from 'zod';

export const appointmentFormSchema = z.object({
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  servico: z.string().min(1, 'Serviço é obrigatório'),
  data: z.date({
    required_error: "Data é obrigatória",
  }),
  hora: z.string().min(1, 'Hora é obrigatória'),
  localizacao: z.string().optional(),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  lembrete: z.array(z.enum(['email', 'whatsapp', 'google'])).optional(),
  antecedencia: z.string().optional(),
  observacoes: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string;
}

export interface ClientOption {
  label: string;
  value: string;
  phone?: string;
  email?: string;
}

export interface Appointment {
  id: string;
  title: string;
  client_id: string | null;
  start_time: string;
  end_time: string;
  description?: string;
  status?: string;
  client_name?: string;
  client_avatar?: string;
}

export const servicosPredefinidos = [
  { label: "Piercing Industrial", value: "piercing_industrial" },
  { label: "Piercing Helix", value: "piercing_helix" },
  { label: "Piercing Septum", value: "piercing_septum" },
  { label: "Piercing Labret", value: "piercing_labret" },
  { label: "Piercing Tragus", value: "piercing_tragus" }
];

export const horariosDisponiveis = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

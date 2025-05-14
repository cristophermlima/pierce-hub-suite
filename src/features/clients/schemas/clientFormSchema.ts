
import { z } from 'zod';

export const clientFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  
  // Dados de anamnese
  birthDate: z.string().optional(),
  address: z.string().optional(),

  // Histórico de saúde
  epilepsy: z.boolean().default(false),
  hemophilia: z.boolean().default(false),
  diabetes: z.boolean().default(false),
  heartDisease: z.boolean().default(false),
  anemia: z.boolean().default(false),
  keloid: z.boolean().default(false),
  dst: z.boolean().default(false),
  hepatitis: z.boolean().default(false),
  dermatitis: z.boolean().default(false),
  otherHealthIssue: z.string().optional(),
  allergies: z.string().optional(),
  
  // Estilo de vida
  physicalActivity: z.boolean().default(false),
  alcohol: z.boolean().default(false),
  smoke: z.boolean().default(false),
  drugs: z.boolean().default(false),
  goodMeals: z.string().optional(),
  mealQuality: z.string().optional(),
  sleepHours: z.string().optional(),
  
  // Informações adicionais
  medication: z.string().optional(),
  whichMedication: z.string().optional(),
  bloodPressure: z.string().optional(),
  
  // Saúde mental
  mentalHealth: z.string().optional(),
  anxiety: z.string().optional(),
  depression: z.string().optional(),
  panic: z.string().optional(),
  
  // Informações do procedimento
  applicationLocation: z.string().optional(),
  jewel: z.string().optional(),
  observation: z.string().optional(),
  value: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

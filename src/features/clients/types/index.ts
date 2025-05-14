
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
  anamnesis?: Anamnesis;
}

export interface Anamnesis {
  // Dados pessoais
  birthDate: string;
  address: string;
  
  // Histórico de saúde
  epilepsy: boolean;
  hemophilia: boolean;
  diabetes: boolean;
  heartDisease: boolean;
  anemia: boolean;
  keloid: boolean;
  dst: boolean;
  hepatitis: boolean;
  dermatitis: boolean;
  otherHealthIssue?: string;
  allergies?: string;
  
  // Estilo de vida
  physicalActivity: boolean;
  alcohol: boolean;
  smoke: boolean;
  drugs: boolean;
  goodMeals: string;
  mealQuality: string;
  sleepHours: string;
  
  // Informações adicionais
  medication: string;
  whichMedication: string;
  bloodPressure: string;
  
  // Saúde mental
  mentalHealth: string;
  anxiety: string;
  depression: string;
  panic: string;
  
  // Informações do procedimento
  applicationLocation: string;
  jewel: string;
  observation: string;
  value: string;
}

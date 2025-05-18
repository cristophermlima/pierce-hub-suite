
import { Client } from '../types';
import { ClientFormValues } from '../schemas/clientFormSchema';

export const filterClients = (clients: Client[], searchTerm: string): Client[] => {
  if (!searchTerm) return clients;
  
  const term = searchTerm.toLowerCase();
  return clients.filter(client => 
    client.name.toLowerCase().includes(term) ||
    client.email.toLowerCase().includes(term) ||
    client.phone.includes(term)
  );
};

export const generateShareableLink = (clientId: string): string => {
  return `https://piercerhub.com/anamnese/${clientId}`;
};

export const generateWhatsAppMessage = (client: Client): string => {
  const formLink = generateShareableLink(client.id);
  return `Olá ${client.name}, precisamos que preencha o formulário de anamnese antes do seu procedimento. Acesse o link: ${formLink}`;
};

export const openWhatsAppShare = (client: Client): void => {
  const message = generateWhatsAppMessage(client);
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
};

// Funções para mensagens em datas especiais
export const generateBirthdayMessage = (client: Client): string => {
  return `Feliz Aniversário, ${client.name}! 🎂 Desejamos a você um dia incrível e cheio de alegrias. Esperamos ver você em breve!`;
};

export const generateHolidayMessage = (client: Client, holiday: string): string => {
  switch (holiday.toLowerCase()) {
    case 'natal':
      return `Olá ${client.name}, desejamos um Feliz Natal para você e sua família! 🎄`;
    case 'ano novo':
      return `Olá ${client.name}, que o Ano Novo traga muita saúde, paz e realizações! 🎉`;
    case 'páscoa':
      return `Olá ${client.name}, desejamos uma Feliz Páscoa cheia de renovação e alegria! 🐰`;
    default:
      return `Olá ${client.name}, felicitamos você nesta data especial! Esperamos ver você em breve.`;
  }
};

export const sendWhatsAppMessage = (client: Client, message: string): void => {
  window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
};

export const sendEmailMessage = (client: Client, subject: string, message: string): void => {
  // Esta é uma simulação - em produção, você usaria uma API de e-mail
  console.log(`[EMAIL] Para: ${client.email}, Assunto: ${subject}, Mensagem: ${message}`);
  // Em produção: 
  // emailService.send({to: client.email, subject, message});
};

export const checkForBirthdays = (clients: Client[]): Client[] => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  
  return clients.filter(client => {
    if (!client.birthDate || !client.sendBirthdayMessage) return false;
    
    // Formato esperado: yyyy-mm-dd
    const birthDate = new Date(client.birthDate);
    return birthDate.getDate() === day && (birthDate.getMonth() + 1) === month;
  });
};

export const getUpcomingHolidays = (): Array<{date: Date, name: string}> => {
  const today = new Date();
  const year = today.getFullYear();
  
  return [
    { date: new Date(year, 11, 25), name: 'Natal' },
    { date: new Date(year, 0, 1), name: 'Ano Novo' },
    // Páscoa é móvel, esta é uma simplificação
    { date: new Date(year, 3, 9), name: 'Páscoa' },
    { date: new Date(year, 9, 12), name: 'Dia das Crianças' },
    { date: new Date(year, 4, 8), name: 'Dia das Mães' },
    { date: new Date(year, 7, 11), name: 'Dia dos Pais' },
  ];
};

export const checkForHolidays = (clients: Client[]): Array<{client: Client, holiday: string}> => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  
  const holidays = getUpcomingHolidays();
  const todaysHoliday = holidays.find(
    h => h.date.getDate() === day && h.date.getMonth() === month
  );
  
  if (!todaysHoliday) return [];
  
  return clients
    .filter(client => client.sendHolidayMessages)
    .map(client => ({ client, holiday: todaysHoliday.name }));
};


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

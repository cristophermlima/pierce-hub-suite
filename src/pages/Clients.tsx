
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import { ClientSearch } from '@/features/clients/components/ClientSearch';
import { ClientList } from '@/features/clients/components/ClientList';
import { ClientDialog } from '@/features/clients/components/ClientDialog';
import { mockClients } from '@/features/clients/data/mockClients';
import { Client } from '@/features/clients/types';
import { ClientFormValues } from '@/features/clients/schemas/clientFormSchema';
import { 
  filterClients, 
  openWhatsAppShare, 
  checkForBirthdays,
  checkForHolidays,
  generateBirthdayMessage,
  generateHolidayMessage,
  sendWhatsAppMessage,
  sendEmailMessage
} from '@/features/clients/utils/clientUtils';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const filteredClients = filterClients(mockClients, searchTerm);

  // Verificar mensagens de datas especiais ao carregar a página
  useEffect(() => {
    const checkSpecialDateMessages = () => {
      // Verificar aniversários
      const birthdayClients = checkForBirthdays(mockClients);
      if (birthdayClients.length > 0) {
        toast({
          title: "Aniversariantes de hoje",
          description: `Há ${birthdayClients.length} cliente(s) fazendo aniversário hoje.`,
        });

        birthdayClients.forEach(client => {
          const message = generateBirthdayMessage(client);
          // Na implementação real, essas mensagens seriam enviadas automaticamente
          // Aqui estamos apenas simulando no console
          console.log(`Mensagem de aniversário para ${client.name}: ${message}`);
        });
      }

      // Verificar datas comemorativas
      const holidayMessages = checkForHolidays(mockClients);
      if (holidayMessages.length > 0) {
        const holiday = holidayMessages[0].holiday;
        toast({
          title: `Hoje é ${holiday}`,
          description: `Há ${holidayMessages.length} cliente(s) que receberão mensagens.`,
        });

        holidayMessages.forEach(({ client, holiday }) => {
          const message = generateHolidayMessage(client, holiday);
          // Na implementação real, essas mensagens seriam enviadas automaticamente
          console.log(`Mensagem de ${holiday} para ${client.name}: ${message}`);
        });
      }
    };

    checkSpecialDateMessages();
    
    // Verificar diariamente (em um app real, isso seria feito no backend)
    const dailyCheck = setInterval(checkSpecialDateMessages, 24 * 60 * 60 * 1000);
    return () => clearInterval(dailyCheck);
  }, [toast]);

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    toast({
      title: "Cliente excluído",
      description: `${client.name} foi excluído com sucesso.`,
    });
  };

  const handleSubmitForm = (data: ClientFormValues) => {
    if (selectedClient) {
      toast({
        title: "Cliente atualizado",
        description: `As informações de ${data.name} foram atualizadas.`,
      });
    } else {
      toast({
        title: "Cliente adicionado",
        description: "Novo cliente adicionado com sucesso.",
      });
    }
    
    // Aqui seria o ponto de integração com o backend
    console.log('Dados do cliente para o backend:', data);
  };

  const handleSendForm = (client: Client) => {
    openWhatsAppShare(client);
    
    toast({
      title: "Link enviado",
      description: `Um link para o formulário foi enviado para ${client.name}.`,
    });
  };

  const handleSendSpecialMessage = (client: Client, type: 'birthday' | 'holiday', holidayName?: string) => {
    let message;
    let subject;

    if (type === 'birthday') {
      message = generateBirthdayMessage(client);
      subject = 'Feliz Aniversário!';
    } else {
      message = generateHolidayMessage(client, holidayName || 'Feriado');
      subject = `Feliz ${holidayName}!`;
    }

    // Enviar via WhatsApp
    sendWhatsAppMessage(client, message);

    // Enviar via Email
    sendEmailMessage(client, subject, message);

    toast({
      title: "Mensagem enviada",
      description: `Mensagem especial enviada para ${client.name} via WhatsApp e Email.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <ClientSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <Button onClick={handleAddClient}>
          <Plus size={18} className="mr-2" />
          Adicionar Cliente
        </Button>
      </div>

      <ClientList 
        clients={filteredClients} 
        onEdit={handleEditClient} 
        onDelete={handleDeleteClient} 
        onSendForm={handleSendForm} 
      />

      <ClientDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedClient={selectedClient}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};

export default Clients;

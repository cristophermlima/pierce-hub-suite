
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import { ClientSearch } from '@/features/clients/components/ClientSearch';
import { ClientList } from '@/features/clients/components/ClientList';
import { ClientDialog } from '@/features/clients/components/ClientDialog';
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
import { 
  getClients, 
  createClient, 
  updateClient, 
  deleteClient 
} from '@/features/clients/services/clientService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch clients data
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: (data: { id: string, client: ClientFormValues }) => 
      updateClient(data.id, data.client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  const filteredClients = filterClients(clients, searchTerm);

  // Verificar mensagens de datas especiais ao carregar a página
  useEffect(() => {
    const checkSpecialDateMessages = () => {
      // Verificar aniversários
      const birthdayClients = checkForBirthdays(clients);
      if (birthdayClients.length > 0) {
        toast({
          title: "Aniversariantes de hoje",
          description: `Há ${birthdayClients.length} cliente(s) fazendo aniversário hoje.`,
        });

        birthdayClients.forEach(client => {
          const message = generateBirthdayMessage(client);
          // Na implementação real, essas mensagens seriam enviadas automaticamente
          console.log(`Mensagem de aniversário para ${client.name}: ${message}`);
        });
      }

      // Verificar datas comemorativas
      const holidayMessages = checkForHolidays(clients);
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

    if (clients.length > 0) {
      checkSpecialDateMessages();
    }
  }, [clients, toast]);

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    if (window.confirm(`Tem certeza que deseja excluir ${client.name}?`)) {
      deleteClientMutation.mutate(client.id);
    }
  };

  const handleSubmitForm = (data: ClientFormValues) => {
    if (selectedClient) {
      updateClientMutation.mutate({ id: selectedClient.id, client: data });
    } else {
      createClientMutation.mutate(data);
    }
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Erro ao carregar clientes. Por favor, tente novamente.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['clients'] })}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

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

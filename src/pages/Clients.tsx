
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ClientSearch } from '@/features/clients/components/ClientSearch';
import { ClientList } from '@/features/clients/components/ClientList';
import { ClientDialog } from '@/features/clients/components/ClientDialog';
import { AnamnesisViewDialog } from '@/features/clients/components/AnamnesisViewDialog';
import { DigitizeAnamnesisDialog } from '@/features/clients/components/DigitizeAnamnesisDialog';
import { Client } from '@/features/clients/types';
import { ClientFormValues } from '@/features/clients/schemas/clientFormSchema';
import { 
  filterClients, 
  openWhatsAppShare, 
  generateShareableLink,
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
import { generateFormToken } from '@/features/clients/services/clientFormService';
import { FormLinkManager } from '@/features/clients/components/FormLinkManager';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnamnesisViewOpen, setIsAnamnesisViewOpen] = useState(false);
  const [isDigitizeDialogOpen, setIsDigitizeDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

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
          title: t('birthdayToday'),
          description: `${birthdayClients.length} ${t('birthdayClientsCount')}.`,
        });

        birthdayClients.forEach(client => {
          const message = generateBirthdayMessage(client);
          console.log(`Mensagem de aniversário para ${client.name}: ${message}`);
        });
      }

      // Verificar datas comemorativas
      const holidayMessages = checkForHolidays(clients);
      if (holidayMessages.length > 0) {
        const holiday = holidayMessages[0].holiday;
        toast({
          title: `${t('holidayToday')} ${holiday}`,
          description: `${holidayMessages.length} ${t('holidayClientsCount')}.`,
        });

        holidayMessages.forEach(({ client, holiday }) => {
          const message = generateHolidayMessage(client, holiday);
          console.log(`Mensagem de ${holiday} para ${client.name}: ${message}`);
        });
      }
    };

    if (clients.length > 0) {
      checkSpecialDateMessages();
    }
  }, [clients, toast, t]);

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    if (window.confirm(`${t('confirmDeleteClient')} ${client.name}?`)) {
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

  const handleSendForm = async (client: Client) => {
    try {
      const token = await generateFormToken();
      if (!token) return;

      const formLink = generateShareableLink(token);
      
      // Copy link to clipboard
      await navigator.clipboard.writeText(formLink);
      
      toast({
        title: t('linkCopied'),
        description: `${t('linkCopiedDescription')}. ${client.name}.`,
      });

      // Optionally open WhatsApp
      openWhatsAppShare(client, formLink);
    } catch (error) {
      console.error('Error generating form link:', error);
      toast({
        title: "Erro",
        description: t('errorGeneratingLink'),
        variant: "destructive"
      });
    }
  };

  const handleViewAnamnesis = (client: Client) => {
    setViewingClient(client);
    setIsAnamnesisViewOpen(true);
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
      title: t('messageSent'),
      description: `${t('specialMessageSent')} ${client.name}.`,
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
        <p className="text-destructive">{t('errorLoading')}. {t('tryAgain')}.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['clients'] })}
        >
          {t('tryAgain')}
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
          {t('addClient')}
        </Button>
      </div>

      {/* Digitalizar Anamnese */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Digitalizar Ficha de Anamnese
          </CardTitle>
          <CardDescription className="text-sm">
            Utilize esta função para digitalizar fichas de anamnese preenchidas em papel.
            Ao enviar a foto ou PDF da ficha, o sistema irá ler e converter automaticamente as informações.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => setIsDigitizeDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Digitalizar Ficha em Papel
          </Button>
        </CardContent>
      </Card>

      <FormLinkManager clients={clients} />

      <ClientList 
        clients={filteredClients} 
        onEdit={handleEditClient} 
        onDelete={handleDeleteClient} 
        onSendForm={handleSendForm}
        onViewAnamnesis={handleViewAnamnesis}
      />

      <ClientDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedClient={selectedClient}
        onSubmit={handleSubmitForm}
      />

      <AnamnesisViewDialog 
        client={viewingClient}
        open={isAnamnesisViewOpen}
        onOpenChange={setIsAnamnesisViewOpen}
      />

      <DigitizeAnamnesisDialog
        open={isDigitizeDialogOpen}
        onOpenChange={setIsDigitizeDialogOpen}
        clients={clients}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['clients'] })}
      />
    </div>
  );
};

export default Clients;

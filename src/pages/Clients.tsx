
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import { ClientSearch } from '@/features/clients/components/ClientSearch';
import { ClientList } from '@/features/clients/components/ClientList';
import { ClientDialog } from '@/features/clients/components/ClientDialog';
import { mockClients } from '@/features/clients/data/mockClients';
import { Client } from '@/features/clients/types';
import { ClientFormValues } from '@/features/clients/schemas/clientFormSchema';
import { filterClients, openWhatsAppShare } from '@/features/clients/utils/clientUtils';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const filteredClients = filterClients(mockClients, searchTerm);

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

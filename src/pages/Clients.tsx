
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Gabriel Santos',
    email: 'gabriel@example.com',
    phone: '(11) 99999-1234',
    visits: 3,
    lastVisit: '2025-05-05',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@example.com',
    phone: '(11) 98888-5678',
    visits: 1,
    lastVisit: '2025-05-02',
  },
  {
    id: '3',
    name: 'Lucas Silva',
    email: 'lucas@example.com',
    phone: '(11) 97777-9012',
    visits: 5,
    lastVisit: '2025-04-28',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@example.com',
    phone: '(11) 96666-3456',
    visits: 2,
    lastVisit: '2025-04-20',
  },
  {
    id: '5',
    name: 'João Melo',
    email: 'joao@example.com',
    phone: '(11) 95555-7890',
    visits: 4,
    lastVisit: '2025-04-15',
  },
  {
    id: '6',
    name: 'Fernanda Lima',
    email: 'fernanda@example.com',
    phone: '(11) 94444-1234',
    visits: 1,
    lastVisit: '2025-05-08',
  },
  {
    id: '7',
    name: 'Ricardo Souza',
    email: 'ricardo@example.com',
    phone: '(11) 93333-5678',
    visits: 3,
    lastVisit: '2025-05-01',
  },
  {
    id: '8',
    name: 'Camila Pereira',
    email: 'camila@example.com',
    phone: '(11) 92222-9012',
    visits: 2,
    lastVisit: '2025-04-25',
  }
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

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
      title: "Client deleted",
      description: `${client.name} has been deleted successfully.`,
    });
  };

  const handleSaveClient = () => {
    if (selectedClient) {
      toast({
        title: "Client updated",
        description: `${selectedClient.name}'s information has been updated.`,
      });
    } else {
      toast({
        title: "Client added",
        description: "New client has been added successfully.",
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input 
            placeholder="Search clients..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={handleAddClient}>
          <Plus size={18} className="mr-2" />
          Add Client
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.visits}</TableCell>
                  <TableCell>
                    {new Date(client.lastVisit).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClient(client)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClient(client)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No clients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedClient ? 'Edit Client' : 'Add New Client'}
            </DialogTitle>
            <DialogDescription>
              {selectedClient 
                ? 'Edit client information.'
                : 'Fill in the details to add a new client.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input 
                id="name" 
                defaultValue={selectedClient?.name}
                placeholder="Client name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input 
                id="email" 
                type="email"
                defaultValue={selectedClient?.email}
                placeholder="client@example.com"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <Input 
                id="phone" 
                defaultValue={selectedClient?.phone}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClient}>
              {selectedClient ? 'Save Changes' : 'Add Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;

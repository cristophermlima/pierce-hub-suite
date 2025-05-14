
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
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
  anamnesis?: Anamnesis;
}

interface Anamnesis {
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

// Schema para validação do formulário
const clientFormSchema = z.object({
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

type ClientFormValues = z.infer<typeof clientFormSchema>;

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState('dados');
  const { toast } = useToast();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      epilepsy: false,
      hemophilia: false,
      diabetes: false,
      heartDisease: false,
      anemia: false,
      keloid: false,
      dst: false,
      hepatitis: false,
      dermatitis: false,
      physicalActivity: false,
      alcohol: false,
      smoke: false,
      drugs: false,
    }
  });

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleAddClient = () => {
    setSelectedClient(null);
    form.reset({
      name: '',
      email: '',
      phone: '',
      epilepsy: false,
      hemophilia: false,
      diabetes: false,
      heartDisease: false,
      anemia: false,
      keloid: false,
      dst: false,
      hepatitis: false,
      dermatitis: false,
      physicalActivity: false,
      alcohol: false,
      smoke: false,
      drugs: false,
    });
    setActiveTab('dados');
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    form.reset({
      name: client.name,
      email: client.email,
      phone: client.phone,
      ...client.anamnesis
    });
    setActiveTab('dados');
    setIsDialogOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    toast({
      title: "Cliente excluído",
      description: `${client.name} foi excluído com sucesso.`,
    });
  };

  const onSubmit = (data: ClientFormValues) => {
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
    setIsDialogOpen(false);

    // Aqui seria o ponto de integração com o backend
    console.log('Dados do cliente para o backend:', data);
  };

  const handleSendForm = (client: Client) => {
    // Aqui seria a integração com o backend para gerar um link para o cliente
    const formLink = `https://piercerhub.com/anamnese/${client.id}`;
    
    // Mensagem para o WhatsApp
    const whatsappMessage = `Olá ${client.name}, precisamos que preencha o formulário de anamnese antes do seu procedimento. Acesse o link: ${formLink}`;
    
    // Abrir o link para WhatsApp
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    
    toast({
      title: "Link enviado",
      description: `Um link para o formulário foi enviado para ${client.name}.`,
    });
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
            placeholder="Buscar clientes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={handleAddClient}>
          <Plus size={18} className="mr-2" />
          Adicionar Cliente
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Atendimentos</TableHead>
              <TableHead>Último Atendimento</TableHead>
              <TableHead className="w-[180px] text-right">Ações</TableHead>
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
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSendForm(client)}
                      >
                        Enviar Anamnese
                      </Button>
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
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
            </DialogTitle>
            <DialogDescription>
              {selectedClient 
                ? 'Edite as informações do cliente.'
                : 'Preencha os detalhes para adicionar um novo cliente.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="saude">Histórico de Saúde</TabsTrigger>
                  <TabsTrigger value="estilo">Estilo de Vida</TabsTrigger>
                  <TabsTrigger value="procedimento">Procedimento</TabsTrigger>
                </TabsList>
              
                <TabsContent value="dados" className="pt-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome completo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="cliente@exemplo.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="(00) 00000-0000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Endereço completo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="saude" className="pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Histórico de Saúde</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="epilepsy"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Epilepsia</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="hemophilia"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Hemofilia</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="diabetes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Diabetes</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="heartDisease"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Doenças Cardíacas</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="anemia"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Anemia</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="keloid"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Queloide</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dst"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>DSTs</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="hepatitis"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Hepatite</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dermatitis"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Dermatite</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="otherHealthIssue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tem algum problema de saúde?</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Descreva aqui" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tem alguma alergia?</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Descreva aqui" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="estilo" className="pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Estilo de Vida</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="physicalActivity"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Atividade física</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="alcohol"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Bebida alcoólica</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="smoke"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Cigarro</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="drugs"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Outras drogas</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="goodMeals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alimentou-se bem nas últimas 24 horas?</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Resposta" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mealQuality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Como considera a sua alimentação?</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Resposta" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sleepHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dorme quantas horas por dia?</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Resposta" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-medium">Informações Importantes</h3>
                      
                      <FormField
                        control={form.control}
                        name="medication"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Faz uso de algum medicamento?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Resposta" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="whichMedication"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qual?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Resposta" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bloodPressure"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pressão sanguínea normal/alta/baixa?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Resposta" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-medium">Saúde Mental</h3>
                      
                      <FormField
                        control={form.control}
                        name="mentalHealth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Saudável?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Resposta" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="anxiety"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ansiedade?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Resposta" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="depression"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Depressão?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Resposta" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="panic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pânico?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Resposta" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="procedimento" className="pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Procedimento</h3>
                    
                    <FormField
                      control={form.control}
                      name="applicationLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Local da aplicação</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: Orelha, nariz, etc" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="jewel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Joia</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Descreva a joia utilizada" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="observation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observação</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Observações adicionais" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="R$ 0,00" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="mt-6 p-4 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        DECLARO QUE RECEBI TODAS AS INFORMAÇÕES REFERENTES AO PROCEDIMENTO UTILIZADO, BEM COMO AOS 
                        CUIDADOS A SEREM TOMADOS DEPOIS DA REALIZAÇÃO DO MESMO. VERIFICO QUE OS MATERIAIS UTILIZADOS SÃO 
                        DEVIDAMENTE ESTERILIZADOS E LACRADOS, BEM COMO VERIFIQUEI QUE OS MATERIAIS SÃO DESCARTADOS 
                        APÓS O PROCEDIMENTO, AUTORIZO A VERIFICAÇÃO DO MATERIAL EXECUTADO ATRAVÉS DAS MINHAS 
                        REDES SOCIAIS, ISENTANDO-O DE QUALQUER BÔNUS E/OU ÔNUS ADVINDO DA EXPOSIÇÃO DA MINHA IMAGEM.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {selectedClient ? 'Salvar Alterações' : 'Adicionar Cliente'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;

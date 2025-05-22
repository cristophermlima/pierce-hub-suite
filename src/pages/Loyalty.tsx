
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Gift, 
  Search, 
  Plus, 
  Award, 
  Star, 
  Users, 
  Calendar, 
  Percent,
  Loader2 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  visits: number;
  last_visit: string | null;
}

const mockPromotions = [
  { 
    id: 1, 
    title: 'Desconto na Segunda Visita', 
    description: '15% de desconto em qualquer serviço na segunda visita',
    condition: 'Segunda visita',
    reward: '15% de desconto',
    active: true
  },
  { 
    id: 2, 
    title: 'Cliente Fiel', 
    description: 'Após 5 visitas, ganhe um piercing básico gratuito',
    condition: '5 visitas',
    reward: '1 piercing básico grátis',
    active: true
  },
  { 
    id: 3, 
    title: 'Aniversariante do Mês', 
    description: 'No mês do seu aniversário, ganhe 20% de desconto em qualquer serviço',
    condition: 'Aniversário no mês',
    reward: '20% de desconto',
    active: true
  },
  { 
    id: 4, 
    title: 'Indique um Amigo', 
    description: 'Para cada amigo indicado, ganhe R$ 15 de desconto na próxima visita',
    condition: 'Indicação de amigo',
    reward: 'R$ 15 de desconto',
    active: false
  }
];

const campaignSchema = z.object({
  title: z.string().min(3, 'Título muito curto'),
  description: z.string().min(10, 'Descrição muito curta'),
  condition: z.string().min(3, 'Condição muito curta'),
  reward: z.string().min(3, 'Recompensa muito curta'),
  active: z.boolean().default(true),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

const Loyalty = () => {
  const [clientSearch, setClientSearch] = useState('');
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [activePromotion, setActivePromotion] = useState<typeof mockPromotions[0] | null>(null);
  
  const campaignForm = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      description: '',
      condition: '',
      reward: '',
      active: true,
    }
  });

  // Query para buscar clientes
  const { data: clients, isLoading } = useQuery({
    queryKey: ['loyalty-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('visits', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const filteredClients = clients?.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  const handleNewPromotion = () => {
    setActivePromotion(null);
    campaignForm.reset();
    setPromotionDialogOpen(true);
  };

  const handleEditPromotion = (promotion: typeof mockPromotions[0]) => {
    setActivePromotion(promotion);
    campaignForm.reset({
      title: promotion.title,
      description: promotion.description,
      condition: promotion.condition,
      reward: promotion.reward,
      active: promotion.active,
    });
    setPromotionDialogOpen(true);
  };

  const onSubmitPromotion = (data: CampaignFormValues) => {
    // Aqui seria implementada a lógica para salvar no banco de dados
    console.log('Dados da promoção:', data);
    toast.success(
      activePromotion 
        ? 'Promoção atualizada com sucesso' 
        : 'Nova promoção criada com sucesso'
    );
    setPromotionDialogOpen(false);
  };

  const handleApplyPromotion = (clientId: string, promotionId: number) => {
    // Implementação simulada para aplicar a promoção ao cliente
    toast.success('Promoção aplicada com sucesso!');
  };

  // Helper para formatar a data da última visita
  const formatLastVisit = (lastVisitDate: string | null) => {
    if (!lastVisitDate) return 'Nunca visitou';
    
    const date = new Date(lastVisitDate);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Helper para recomendar campanhas com base nos dados do cliente
  const getRecommendedCampaign = (visits: number) => {
    if (visits === 1) return 'Desconto na Segunda Visita';
    if (visits >= 4) return 'Cliente Fiel';
    return 'Indique um Amigo';
  };

  // Status do cliente baseado em número de visitas
  const getClientStatus = (visits: number) => {
    if (visits >= 10) return { label: 'VIP', color: 'bg-purple-500' };
    if (visits >= 5) return { label: 'Frequente', color: 'bg-blue-500' };
    if (visits >= 1) return { label: 'Regular', color: 'bg-green-500' };
    return { label: 'Novo', color: 'bg-gray-500' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Programa de Fidelidade</h1>
        <p className="text-muted-foreground">
          Gerencie campanhas de fidelização e recompensas para seus clientes
        </p>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>
        
        {/* Tab de Campanhas */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Campanhas Ativas</h2>
            <Button onClick={handleNewPromotion}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Campanha
            </Button>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {mockPromotions.map(promotion => (
              <Card 
                key={promotion.id} 
                className={`overflow-hidden ${!promotion.active ? 'opacity-60' : ''}`}
              >
                <div className={`h-2 w-full ${promotion.active ? 'bg-primary' : 'bg-muted'}`} />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{promotion.title}</CardTitle>
                    {promotion.active ? (
                      <Badge variant="default">Ativa</Badge>
                    ) : (
                      <Badge variant="outline">Inativa</Badge>
                    )}
                  </div>
                  <CardDescription>{promotion.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="space-y-1">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-2">Condição:</div>
                      <div>{promotion.condition}</div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-2">Recompensa:</div>
                      <div>{promotion.reward}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleEditPromotion(promotion)}
                  >
                    Editar Campanha
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Fidelidade</CardTitle>
              <CardDescription>
                Acompanhe o desempenho do seu programa de fidelidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Award className="h-8 w-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">42</span>
                  <span className="text-sm text-muted-foreground">Recompensas Resgatadas</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Star className="h-8 w-8 text-amber-500 mb-2" />
                  <span className="text-2xl font-bold">18</span>
                  <span className="text-sm text-muted-foreground">Clientes VIP</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-2xl font-bold">65%</span>
                  <span className="text-sm text-muted-foreground">Taxa de Retenção</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Calendar className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-2xl font-bold">28</span>
                  <span className="text-sm text-muted-foreground">Aniversários este mês</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab de Clientes */}
        <TabsContent value="clients" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="w-full pl-9"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Carregando clientes...</span>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Visitas</TableHead>
                      <TableHead>Última Visita</TableHead>
                      <TableHead>Campanha Recomendada</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients?.length ? (
                      filteredClients.map((client) => {
                        const status = getClientStatus(client.visits);
                        const recommendedCampaign = getRecommendedCampaign(client.visits);
                        
                        return (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-muted-foreground">{client.email}</div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={`${status.color} text-white`}
                              >
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>{client.visits}</TableCell>
                            <TableCell>{formatLastVisit(client.last_visit)}</TableCell>
                            <TableCell>{recommendedCampaign}</TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Gift className="h-4 w-4 mr-1" />
                                    Aplicar
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Aplicar Promoção</DialogTitle>
                                    <DialogDescription>
                                      Selecione uma promoção para aplicar ao cliente {client.name}.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <Label>Promoção</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma promoção" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {mockPromotions
                                          .filter(p => p.active)
                                          .map(promotion => (
                                            <SelectItem key={promotion.id} value={promotion.id.toString()}>
                                              {promotion.title}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <DialogFooter>
                                    <Button 
                                      onClick={() => handleApplyPromotion(client.id, 1)} 
                                      className="w-full sm:w-auto"
                                    >
                                      <Percent className="h-4 w-4 mr-2" />
                                      Aplicar Promoção
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          Nenhum cliente encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog para criar/editar promoções */}
      <Dialog open={promotionDialogOpen} onOpenChange={setPromotionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activePromotion ? 'Editar Campanha' : 'Nova Campanha de Fidelidade'}
            </DialogTitle>
            <DialogDescription>
              {activePromotion 
                ? 'Edite as informações da campanha existente.' 
                : 'Crie uma nova campanha para fidelizar seus clientes.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={campaignForm.handleSubmit(onSubmitPromotion)} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                placeholder="Ex: Desconto na Segunda Visita"
                {...campaignForm.register('title')}
              />
              {campaignForm.formState.errors.title && (
                <p className="text-sm text-destructive">{campaignForm.formState.errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input 
                id="description" 
                placeholder="Ex: 15% de desconto em qualquer serviço na segunda visita"
                {...campaignForm.register('description')}
              />
              {campaignForm.formState.errors.description && (
                <p className="text-sm text-destructive">{campaignForm.formState.errors.description.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condição</Label>
                <Input 
                  id="condition" 
                  placeholder="Ex: Segunda visita"
                  {...campaignForm.register('condition')}
                />
                {campaignForm.formState.errors.condition && (
                  <p className="text-sm text-destructive">{campaignForm.formState.errors.condition.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reward">Recompensa</Label>
                <Input 
                  id="reward" 
                  placeholder="Ex: 15% de desconto"
                  {...campaignForm.register('reward')}
                />
                {campaignForm.formState.errors.reward && (
                  <p className="text-sm text-destructive">{campaignForm.formState.errors.reward.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="active" 
                className="rounded border-gray-300 text-primary focus:ring-primary"
                {...campaignForm.register('active')}
              />
              <Label htmlFor="active" className="cursor-pointer">Ativar campanha</Label>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPromotionDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {activePromotion ? 'Salvar Alterações' : 'Criar Campanha'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Loyalty;

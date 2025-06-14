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
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useLoyalty } from '@/features/loyalty/hooks/useLoyalty';
import { useLoyaltyPlans } from "@/features/loyalty/hooks/useLoyaltyPlans";
import { LoyaltyPlanDialog } from "@/features/loyalty/components/LoyaltyPlanDialog";
import { LoyaltyPlansTable } from "@/features/loyalty/components/LoyaltyPlansTable";

const Loyalty = () => {
  const [clientSearch, setClientSearch] = useState('');
  const { loyaltyClients, loyaltyPromotions, isLoading, getBirthdayClients } = useLoyalty();
  const { plans, createPlan, editPlan, deletePlan, isLoading: loadingPlans } = useLoyaltyPlans();
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<any>(null);

  const filteredClients = loyaltyClients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  const birthdayClients = getBirthdayClients();

  // Helper para formatar a data da última visita
  const formatLastVisit = (lastVisitDate: string | null) => {
    if (!lastVisitDate) return 'Nunca visitou';
    
    const date = new Date(lastVisitDate);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Status do cliente baseado em número de visitas
  const getClientStatus = (level: string) => {
    switch (level) {
      case 'vip': return { label: 'VIP', color: 'bg-purple-500' };
      case 'frequente': return { label: 'Frequente', color: 'bg-blue-500' };
      case 'regular': return { label: 'Regular', color: 'bg-green-500' };
      default: return { label: 'Novo', color: 'bg-gray-500' };
    }
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
            <h2 className="text-lg font-semibold">Planos Personalizados</h2>
            <Button onClick={() => { setPlanDialogOpen(true); setPlanToEdit(null); }}>Novo Plano</Button>
          </div>
          <LoyaltyPlansTable
            plans={plans}
            onEdit={(plan) => { setPlanToEdit(plan); setPlanDialogOpen(true); }}
            onDelete={deletePlan}
          />
          <LoyaltyPlanDialog
            open={planDialogOpen}
            onOpenChange={setPlanDialogOpen}
            onSave={planToEdit ? (data) => editPlan({ id: planToEdit.id, plan: data }) : createPlan}
            loading={loadingPlans}
            defaultValues={planToEdit}
          />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {loyaltyPromotions.map(promotion => (
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
                  <span className="text-2xl font-bold">{loyaltyClients.filter(c => c.discountEligible).length}</span>
                  <span className="text-sm text-muted-foreground">Elegíveis para Desconto</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Star className="h-8 w-8 text-amber-500 mb-2" />
                  <span className="text-2xl font-bold">{loyaltyClients.filter(c => c.loyaltyLevel === 'vip').length}</span>
                  <span className="text-sm text-muted-foreground">Clientes VIP</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-2xl font-bold">{loyaltyClients.length}</span>
                  <span className="text-sm text-muted-foreground">Total de Clientes</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Calendar className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-2xl font-bold">{birthdayClients.length}</span>
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
                      <TableHead>Próxima Recompensa</TableHead>
                      <TableHead>Desconto Disponível</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients?.length ? (
                      filteredClients.map((client) => {
                        const status = getClientStatus(client.loyaltyLevel);
                        
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
                            <TableCell>{formatLastVisit(client.lastVisit)}</TableCell>
                            <TableCell className="text-sm">{client.nextReward}</TableCell>
                            <TableCell>
                              {client.discountEligible ? (
                                <Badge variant="default" className="bg-green-500">
                                  15% Segunda Visita
                                </Badge>
                              ) : client.birthDate && client.birthDate.includes(new Date().getMonth().toString().padStart(2, '0')) ? (
                                <Badge variant="default" className="bg-purple-500">
                                  20% Aniversário
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">Nenhum</span>
                              )}
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
    </div>
  );
};

export default Loyalty;

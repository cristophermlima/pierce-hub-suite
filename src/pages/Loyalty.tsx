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
  Award, 
  Star, 
  Users, 
  Calendar, 
  Search,
  Loader2,
  UserPlus,
  Gift
} from 'lucide-react';
import { useLoyalty } from '@/features/loyalty/hooks/useLoyalty';
import { useLoyaltyPlans } from "@/features/loyalty/hooks/useLoyaltyPlans";
import { useClientLoyalty } from "@/features/loyalty/hooks/useClientLoyalty";
import { LoyaltyPlanDialog } from "@/features/loyalty/components/LoyaltyPlanDialog";
import { LoyaltyPlansTable } from "@/features/loyalty/components/LoyaltyPlansTable";
import { EnrollClientDialog } from "@/features/loyalty/components/EnrollClientDialog";
import { ClientLoyaltyCard } from "@/features/loyalty/components/ClientLoyaltyCard";
import { useTranslation } from '@/hooks/useTranslation';

const Loyalty = () => {
  const { t } = useTranslation();
  const [clientSearch, setClientSearch] = useState('');
  const [enrollSearch, setEnrollSearch] = useState('');
  const { loyaltyClients, loyaltyPromotions, isLoading, getBirthdayClients } = useLoyalty();
  const { plans, createPlan, editPlan, deletePlan, isLoading: loadingPlans } = useLoyaltyPlans();
  const { clientLoyalties, isLoading: loadingEnrollments, checkEligibility } = useClientLoyalty();
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<any>(undefined);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedPlanForEnroll, setSelectedPlanForEnroll] = useState<string | undefined>();

  const filteredClients = loyaltyClients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  const filteredEnrollments = clientLoyalties.filter(enrollment =>
    enrollment.client?.name?.toLowerCase().includes(enrollSearch.toLowerCase()) ||
    enrollment.plan?.name?.toLowerCase().includes(enrollSearch.toLowerCase())
  );

  const birthdayClients = getBirthdayClients();

  // Contar clientes elegíveis para recompensa
  const eligibleCount = clientLoyalties.filter(cl => checkEligibility(cl).eligible).length;

  // Helper para formatar a data da última visita
  const formatLastVisit = (lastVisitDate: string | null) => {
    if (!lastVisitDate) return t('neverVisited');
    
    const date = new Date(lastVisitDate);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Status do cliente baseado em número de visitas
  const getClientStatus = (level: string) => {
    switch (level) {
      case 'vip': return { label: t('vip'), color: 'bg-purple-500' };
      case 'frequente': return { label: t('frequent'), color: 'bg-blue-500' };
      case 'regular': return { label: t('regular'), color: 'bg-green-500' };
      default: return { label: t('newClient'), color: 'bg-gray-500' };
    }
  };

  const handleEnrollFromPlan = (planId: string) => {
    setSelectedPlanForEnroll(planId);
    setEnrollDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('loyaltyTitle')}</h1>
        <p className="text-muted-foreground">
          {t('loyaltyDescription')}
        </p>
      </div>

      <Tabs defaultValue="enrollments">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enrollments">Clientes Vinculados</TabsTrigger>
          <TabsTrigger value="campaigns">{t('campaigns')}</TabsTrigger>
          <TabsTrigger value="clients">{t('clients')}</TabsTrigger>
        </TabsList>

        {/* Tab de Clientes Vinculados aos Planos */}
        <TabsContent value="enrollments" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por cliente ou plano..."
                className="w-full pl-9"
                value={enrollSearch}
                onChange={(e) => setEnrollSearch(e.target.value)}
              />
            </div>
            <Button onClick={() => { setSelectedPlanForEnroll(undefined); setEnrollDialogOpen(true); }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Matricular Cliente
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{clientLoyalties.length}</div>
                    <div className="text-xs text-muted-foreground">Vinculados</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Gift className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{eligibleCount}</div>
                    <div className="text-xs text-muted-foreground">Elegíveis</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-amber-500" />
                  <div>
                    <div className="text-2xl font-bold">{plans.filter(p => p.active).length}</div>
                    <div className="text-xs text-muted-foreground">Planos Ativos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{birthdayClients.length}</div>
                    <div className="text-xs text-muted-foreground">Aniversariantes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Clientes Vinculados */}
          {loadingEnrollments ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Carregando...</span>
            </div>
          ) : filteredEnrollments.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum cliente vinculado a planos de fidelidade</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setEnrollDialogOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Matricular primeiro cliente
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEnrollments.map(enrollment => (
                <ClientLoyaltyCard 
                  key={enrollment.id} 
                  enrollment={enrollment}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Tab de Campanhas */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{t('customPlans')}</h2>
            <Button onClick={() => { setPlanDialogOpen(true); setPlanToEdit(undefined); }}>{t('newPlan')}</Button>
          </div>
          <LoyaltyPlansTable
            plans={plans}
            onEdit={(plan) => { setPlanToEdit(plan); setPlanDialogOpen(true); }}
            onDelete={deletePlan}
            onEnrollClient={handleEnrollFromPlan}
          />
          <LoyaltyPlanDialog
            open={planDialogOpen}
            onOpenChange={setPlanDialogOpen}
            onSave={planToEdit ? (data) => editPlan({ id: planToEdit.id, plan: data }) : createPlan}
            loading={loadingPlans}
            defaultValues={planToEdit}
          />

          <Card>
            <CardHeader>
              <CardTitle>{t('loyaltyStats')}</CardTitle>
              <CardDescription>
                {t('loyaltyStatsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Award className="h-8 w-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">{eligibleCount}</span>
                  <span className="text-sm text-muted-foreground">{t('eligibleForDiscount')}</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Star className="h-8 w-8 text-amber-500 mb-2" />
                  <span className="text-2xl font-bold">{loyaltyClients.filter(c => c.loyaltyLevel === 'vip').length}</span>
                  <span className="text-sm text-muted-foreground">{t('vipClients')}</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-2xl font-bold">{clientLoyalties.length}</span>
                  <span className="text-sm text-muted-foreground">Vinculados a Planos</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Calendar className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-2xl font-bold">{birthdayClients.length}</span>
                  <span className="text-sm text-muted-foreground">{t('birthdaysThisMonth')}</span>
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
                placeholder={t('searchClients2')}
                className="w-full pl-9"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>{t('loadingClients')}</span>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('client')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      <TableHead>{t('visits')}</TableHead>
                      <TableHead>{t('lastVisit')}</TableHead>
                      <TableHead>{t('nextReward')}</TableHead>
                      <TableHead>{t('availableDiscount')}</TableHead>
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
                                  15% {t('secondVisit')}
                                </Badge>
                              ) : client.birthDate && client.birthDate.includes(new Date().getMonth().toString().padStart(2, '0')) ? (
                                <Badge variant="default" className="bg-purple-500">
                                  20% {t('birthday')}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">{t('none')}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          {t('noClientsFound')}
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

      {/* Dialog para matricular clientes */}
      <EnrollClientDialog
        open={enrollDialogOpen}
        onOpenChange={setEnrollDialogOpen}
        preselectedPlanId={selectedPlanForEnroll}
      />
    </div>
  );
};

export default Loyalty;

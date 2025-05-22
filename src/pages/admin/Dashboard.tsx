
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Calendar, Users, Package, Activity, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  // Query para buscar estatísticas
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      // Na versão final, estas solicitações seriam feitas ao backend
      // Modificando para usar tabelas que existem no banco de dados
      const [
        { count: clientCount, error: clientError },
        { count: appointmentCount, error: appointmentError },
        { count: inventoryCount, error: inventoryError }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('inventory').select('*', { count: 'exact', head: true })
      ]);

      if (clientError || appointmentError || inventoryError) {
        console.error("Erros ao buscar estatísticas:", { clientError, appointmentError, inventoryError });
        throw new Error("Erro ao buscar estatísticas");
      }

      return {
        users: clientCount || 0,
        appointments: appointmentCount || 0,
        inventory: inventoryCount || 0,
        revenue: 12500, // Dados de exemplo
        activeSubscriptions: 42, // Dados de exemplo
        trialConversions: 65 // Dados de exemplo
      };
    },
    // Desativado no modo de desenvolvimento
    enabled: false
  });

  // Dados de exemplo para o painel administrativo
  const mockStats = {
    users: 58,
    appointments: 124,
    inventory: 87,
    revenue: 12500,
    activeSubscriptions: 42,
    trialConversions: 65
  };

  const statsData = stats || mockStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel de Administração</h1>
        <p className="text-muted-foreground">
          Gerencie usuários, assinaturas e analise o desempenho do PiercerHub.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários Totais
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.users}</div>
            <p className="text-xs text-muted-foreground">
              +12 na última semana
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agendamentos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.appointments}</div>
            <p className="text-xs text-muted-foreground">
              +18% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Itens de Inventário
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.inventory}</div>
            <p className="text-xs text-muted-foreground">
              +5 itens adicionados este mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total (R$)
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {statsData.revenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              +5% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscriptions">
        <TabsList>
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscriptions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assinaturas Ativas</CardTitle>
                <CardDescription>
                  Monitoramento de assinaturas ativas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Total de assinaturas ativas:</span>
                  <span className="font-bold">{statsData.activeSubscriptions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Plano Mensal:</span>
                  <span className="font-bold">{Math.floor(statsData.activeSubscriptions * 0.7)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Plano Anual:</span>
                  <span className="font-bold">{Math.floor(statsData.activeSubscriptions * 0.3)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Conversão</CardTitle>
                <CardDescription>
                  Conversões de período de teste para pagantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Conversão de testes:</span>
                  <span className="font-bold">{statsData.trialConversions}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Períodos de teste ativos:</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Expirando em 48h:</span>
                  <span className="font-bold">3</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Configurações de Assinatura</CardTitle>
              <CardDescription>
                Gerencie planos e preços
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 border p-4 rounded-lg">
                  <div className="font-medium">Plano Mensal</div>
                  <div className="text-2xl font-bold">R$ 19,90</div>
                  <div className="text-muted-foreground">por mês</div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Editar Plano
                  </Button>
                </div>
                
                <div className="space-y-2 border p-4 rounded-lg">
                  <div className="font-medium">Plano Anual</div>
                  <div className="text-2xl font-bold">R$ 159,90</div>
                  <div className="text-muted-foreground">por ano (33% de desconto)</div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Editar Plano
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium">Período de teste</div>
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <div className="font-medium">7 dias gratuitos</div>
                    <div className="text-sm text-muted-foreground">Acesso a todas as funcionalidades</div>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Visualize e gerencie todos os usuários da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-2 px-4 text-left font-medium">Usuário</th>
                      <th className="py-2 px-4 text-left font-medium">Status</th>
                      <th className="py-2 px-4 text-left font-medium">Plano</th>
                      <th className="py-2 px-4 text-left font-medium">Desde</th>
                      <th className="py-2 px-4 text-left font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4">Studio Laser</td>
                      <td className="py-2 px-4">
                        <span className="bg-green-500/20 text-green-600 text-xs px-2 py-1 rounded-full">
                          Ativo
                        </span>
                      </td>
                      <td className="py-2 px-4">Anual</td>
                      <td className="py-2 px-4">15/04/2025</td>
                      <td className="py-2 px-4">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Piercing & Art</td>
                      <td className="py-2 px-4">
                        <span className="bg-green-500/20 text-green-600 text-xs px-2 py-1 rounded-full">
                          Ativo
                        </span>
                      </td>
                      <td className="py-2 px-4">Mensal</td>
                      <td className="py-2 px-4">10/05/2025</td>
                      <td className="py-2 px-4">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Body Art Studio</td>
                      <td className="py-2 px-4">
                        <span className="bg-yellow-500/20 text-yellow-600 text-xs px-2 py-1 rounded-full">
                          Teste
                        </span>
                      </td>
                      <td className="py-2 px-4">Teste Gratuito</td>
                      <td className="py-2 px-4">20/05/2025</td>
                      <td className="py-2 px-4">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">Perfect Tattoo</td>
                      <td className="py-2 px-4">
                        <span className="bg-red-500/20 text-red-600 text-xs px-2 py-1 rounded-full">
                          Expirado
                        </span>
                      </td>
                      <td className="py-2 px-4">Mensal</td>
                      <td className="py-2 px-4">01/03/2025</td>
                      <td className="py-2 px-4">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Exportar dados</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios & Análises</CardTitle>
              <CardDescription>
                Visualize métricas e tendências do negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Receita Mensal (R$)</h3>
                  <div className="relative h-40">
                    <div className="flex h-full items-end">
                      <div className="w-1/6 h-[55%] bg-primary mr-2 rounded-t-md"></div>
                      <div className="w-1/6 h-[65%] bg-primary mr-2 rounded-t-md"></div>
                      <div className="w-1/6 h-[45%] bg-primary mr-2 rounded-t-md"></div>
                      <div className="w-1/6 h-[70%] bg-primary mr-2 rounded-t-md"></div>
                      <div className="w-1/6 h-[85%] bg-primary mr-2 rounded-t-md"></div>
                      <div className="w-1/6 h-[95%] bg-primary mr-0 rounded-t-md"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <div>Jan</div>
                    <div>Feb</div>
                    <div>Mar</div>
                    <div>Abr</div>
                    <div>Mai</div>
                    <div>Jun</div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Novos Usuários</h3>
                  <div className="relative h-40">
                    <div className="flex h-full items-end">
                      <div className="w-1/6 h-[35%] bg-green-500 mr-2 rounded-t-md"></div>
                      <div className="w-1/6 h-[45%] bg-green-500 mr-2 rounded-t-md"></div>
                      <div className="w-1/6 h-[40%] bg-green-500 mr-2 rounded-t-md"></div>
                      <div className="w-1/6 h-[60%] bg-green-500 mr-2 rounded-t-md"></div>
                      <div className="w-1/6 h-[75%] bg-green-500 mr-2 rounded-t-md"></div>
                      <div className="w-1/6 h-[90%] bg-green-500 mr-0 rounded-t-md"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <div>Jan</div>
                    <div>Feb</div>
                    <div>Mar</div>
                    <div>Abr</div>
                    <div>Mai</div>
                    <div>Jun</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-4">Indicadores de Desempenho</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Taxa de Retenção</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full rounded-full bg-primary" style={{ width: '85%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span>LTV Médio</span>
                    <span className="font-medium">R$ 350</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full rounded-full bg-primary" style={{ width: '70%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span>CAC (Custo de Aquisição)</span>
                    <span className="font-medium">R$ 80</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full rounded-full bg-primary" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Exportar Relatórios</Button>
              <Button variant="default">
                <TrendingUp className="mr-2 h-4 w-4" />
                Análise Detalhada
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

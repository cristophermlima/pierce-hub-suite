import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useReportsData } from '@/features/reports/hooks/useReportsData';

const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9C27B0', '#673AB7'];

const Reports = () => {
  const [periodoTempo, setPeriodoTempo] = useState('ano');
  const { toast } = useToast();
  
  const {
    revenueData,
    appointmentsMonthlyData,
    servicesChartData,
    newClientsData,
    totalRevenue,
    totalAppointments,
    totalClients,
    completionRate,
    cancellationRate,
    refetchSales
  } = useReportsData();

  const exportarRelatorio = () => {
    toast({
      title: "Exportando relatório",
      description: "O relatório será baixado em breve.",
    });
  };

  const handleRefresh = () => {
    refetchSales();
    toast({
      title: "Dados atualizados",
      description: "Os relatórios foram atualizados com os dados mais recentes.",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const monthlyRevenue = totalRevenue / 12;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">Análises & Relatórios</h1>
        <div className="flex gap-4">
          <Select 
            value={periodoTempo}
            onValueChange={setPeriodoTempo}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="trimestre">Este Trimestre</SelectItem>
              <SelectItem value="ano">Este Ano</SelectItem>
              <SelectItem value="personalizado">Período Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw size={18} className="mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" onClick={exportarRelatorio}>
            <Download size={18} className="mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Total do ano atual
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="#0088FE" 
                    fillOpacity={1}
                    fill="url(#colorReceita)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% concluídos
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={appointmentsMonthlyData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorConcluidos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="concluidos" 
                    stroke="#00C49F" 
                    fillOpacity={1}
                    fill="url(#colorConcluidos)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={newClientsData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <Bar dataKey="clientes" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="receita">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="receita">Receita</TabsTrigger>
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
        </TabsList>
        <TabsContent value="receita" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Receita</CardTitle>
              <CardDescription>
                Visão geral da receita do seu negócio ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Receita']} />
                  <defs>
                    <linearGradient id="colorReceitaPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="#0088FE" 
                    fillOpacity={1}
                    fill="url(#colorReceitaPrincipal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Receita Anual Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Média Mensal</p>
                <p className="text-xl font-bold">{formatCurrency(monthlyRevenue)}</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="agendamentos" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Agendamentos</CardTitle>
              <CardDescription>
                Acompanhe as tendências e desempenho dos seus agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={appointmentsMonthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="concluidos" name="Concluídos" stackId="a" fill="#00C49F" />
                  <Bar dataKey="cancelados" name="Cancelados" stackId="a" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Total de Agendamentos</p>
                <p className="text-2xl font-bold">{totalAppointments}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Taxa de Conclusão</p>
                <p className="text-xl font-bold">{completionRate}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Taxa de Cancelamento</p>
                <p className="text-xl font-bold text-amber-500">{cancellationRate}%</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="servicos" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Populares</CardTitle>
              <CardDescription>
                Distribuição dos serviços realizados
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-center h-[400px]">
              {servicesChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={servicesChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="valor"
                      label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                    >
                      {servicesChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} serviços`, 'Quantidade']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Nenhum serviço vendido ainda</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-around">
              {servicesChartData.length > 0 && (
                <>
                  <div>
                    <p className="text-sm font-medium">Mais Popular</p>
                    <p className="text-xl font-bold">
                      {servicesChartData.sort((a, b) => b.valor - a.valor)[0]?.nome} ({servicesChartData.sort((a, b) => b.valor - a.valor)[0]?.valor})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total de Serviços</p>
                    <p className="text-xl font-bold">
                      {servicesChartData.reduce((sum, service) => sum + service.valor, 0)}
                    </p>
                  </div>
                </>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;

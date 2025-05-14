
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
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { mockClients } from '@/features/clients/data/mockClients';

// Dados de receita convertidos para português
const dadosReceita = [
  { mes: 'Jan', receita: 4200 },
  { mes: 'Fev', receita: 4800 },
  { mes: 'Mar', receita: 5400 },
  { mes: 'Abr', receita: 6000 },
  { mes: 'Mai', receita: 5700 },
  { mes: 'Jun', receita: 6400 },
  { mes: 'Jul', receita: 7200 },
  { mes: 'Ago', receita: 8500 },
  { mes: 'Set', receita: 8200 },
  { mes: 'Out', receita: 7800 },
  { mes: 'Nov', receita: 7400 },
  { mes: 'Dez', receita: 8500 },
];

// Dados de serviços convertidos para português
const dadosServicos = [
  { nome: 'Lóbulo da Orelha', valor: 125 },
  { nome: 'Hélix', valor: 90 },
  { nome: 'Tragus', valor: 75 },
  { nome: 'Septo', valor: 110 },
  { nome: 'Narina', valor: 130 },
  { nome: 'Outros', valor: 85 },
];

// Dados de agendamento convertidos para português
const dadosAgendamentos = [
  { mes: 'Jan', agendados: 48, concluidos: 42, cancelados: 6 },
  { mes: 'Fev', agendados: 52, concluidos: 45, cancelados: 7 },
  { mes: 'Mar', agendados: 60, concluidos: 55, cancelados: 5 },
  { mes: 'Abr', agendados: 65, concluidos: 58, cancelados: 7 },
  { mes: 'Mai', agendados: 68, concluidos: 60, cancelados: 8 },
  { mes: 'Jun', agendados: 70, concluidos: 65, cancelados: 5 },
  { mes: 'Jul', agendados: 78, concluidos: 70, cancelados: 8 },
  { mes: 'Ago', agendados: 85, concluidos: 78, cancelados: 7 },
  { mes: 'Set', agendados: 80, concluidos: 72, cancelados: 8 },
  { mes: 'Out', agendados: 75, concluidos: 70, cancelados: 5 },
  { mes: 'Nov', agendados: 70, concluidos: 65, cancelados: 5 },
  { mes: 'Dez', agendados: 82, concluidos: 75, cancelados: 7 },
];

// Função para calcular dados consolidados a partir dos dados do sistema
const calcularDadosDoSistema = () => {
  // Total de clientes do sistema
  const totalClientes = mockClients.length;
  
  // Cálculo de novos clientes por trimestre (simulado)
  const novosClientes = [
    { mes: 'Q1', clientes: Math.floor(totalClientes * 0.2) },
    { mes: 'Q2', clientes: Math.floor(totalClientes * 0.25) },
    { mes: 'Q3', clientes: Math.floor(totalClientes * 0.3) },
    { mes: 'Q4', clientes: Math.floor(totalClientes * 0.25) },
  ];
  
  return {
    totalClientes,
    novosClientes,
  };
};

const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9C27B0', '#673AB7'];

const Reports = () => {
  const [periodoTempo, setPeriodoTempo] = useState('ano');
  const { toast } = useToast();
  const dadosSistema = calcularDadosDoSistema();

  const exportarRelatorio = () => {
    toast({
      title: "Exportando relatório",
      description: "O relatório será baixado em breve.",
    });
  };

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
            <div className="text-2xl font-bold">R$ 74.400</div>
            <p className="text-xs text-muted-foreground">
              +18% em relação ao ano anterior
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dadosReceita}
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
            <div className="text-2xl font-bold">833</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao ano anterior
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dadosAgendamentos}
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
              Novos Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dadosSistema.totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              +24% em relação ao ano anterior
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosSistema.novosClientes}
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
                  data={dadosReceita}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" />
                  <YAxis 
                    tickFormatter={(value) => `R$ ${value}`}
                  />
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
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
                <p className="text-2xl font-bold">R$ 74.400</p>
              </div>
              <div>
                <p className="text-sm font-medium">Média Mensal</p>
                <p className="text-xl font-bold">R$ 6.200</p>
              </div>
              <div>
                <p className="text-sm font-medium">Crescimento Anual</p>
                <p className="text-xl font-bold text-green-500">+18%</p>
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
                  data={dadosAgendamentos}
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
                <p className="text-2xl font-bold">833</p>
              </div>
              <div>
                <p className="text-sm font-medium">Taxa de Conclusão</p>
                <p className="text-xl font-bold">91%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Taxa de Cancelamento</p>
                <p className="text-xl font-bold text-amber-500">9%</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="servicos" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Populares</CardTitle>
              <CardDescription>
                Distribuição dos serviços de perfuração realizados
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-center h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosServicos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="valor"
                    label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                  >
                    {dadosServicos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} agendamentos`, 'Quantidade']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-around">
              <div>
                <p className="text-sm font-medium">Mais Popular</p>
                <p className="text-xl font-bold">Narina (130)</p>
              </div>
              <div>
                <p className="text-sm font-medium">Menos Popular</p>
                <p className="text-xl font-bold">Tragus (75)</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total de Serviços</p>
                <p className="text-xl font-bold">615</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;

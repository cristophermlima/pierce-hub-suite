import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, RefreshCw, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useReportsData } from '@/features/reports/hooks/useReportsData';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useTranslation } from '@/hooks/useTranslation';

const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9C27B0', '#673AB7'];

const Reports = () => {
  const [periodoTempo, setPeriodoTempo] = useState('ano');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [showCustomDates, setShowCustomDates] = useState(false);
  const { toast } = useToast();
  const { formatCurrency } = useAppSettings();
  const { t } = useTranslation();
  
  const {
    revenueData, appointmentsMonthlyData, servicesChartData, newClientsData,
    totalRevenue, totalAppointments, totalClients, completionRate, cancellationRate, refetchSales
  } = useReportsData(periodoTempo);

  const handlePeriodChange = (value: string) => {
    setPeriodoTempo(value);
    if (value === 'personalizado') {
      setShowCustomDates(true);
    } else {
      setShowCustomDates(false);
    }
  };

  const handleApplyCustomPeriod = () => {
    if (!dataInicio || !dataFim) {
      toast({ title: 'Erro', description: 'Selecione as datas de início e fim', variant: 'destructive' });
      return;
    }
    if (new Date(dataInicio) > new Date(dataFim)) {
      toast({ title: 'Erro', description: 'A data de início deve ser anterior à data de fim', variant: 'destructive' });
      return;
    }
    refetchSales();
    toast({ title: 'Período aplicado', description: `Relatório de ${dataInicio} até ${dataFim}` });
  };

  const exportarRelatorio = (formato: 'csv' | 'excel' | 'word') => {
    const formatoNomes: Record<string, string> = {
      csv: 'CSV',
      excel: 'Excel',
      word: 'Word'
    };
    
    // Preparar dados para exportação
    const exportData = {
      receita: totalRevenue,
      agendamentos: totalAppointments,
      clientes: totalClients,
      taxaConclusao: completionRate,
      taxaCancelamento: cancellationRate,
      periodo: periodoTempo,
      dataInicio: dataInicio || 'N/A',
      dataFim: dataFim || 'N/A'
    };
    
    if (formato === 'csv') {
      // Gerar CSV
      const headers = ['Métrica', 'Valor'];
      const rows = [
        ['Receita Total', formatCurrency(totalRevenue)],
        ['Total de Agendamentos', totalAppointments.toString()],
        ['Total de Clientes', totalClients.toString()],
        ['Taxa de Conclusão', `${completionRate}%`],
        ['Taxa de Cancelamento', `${cancellationRate}%`],
        ['Período', periodoTempo],
      ];
      
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (formato === 'excel') {
      // Gerar formato compatível com Excel (TSV que Excel abre)
      const headers = ['Métrica', 'Valor'];
      const rows = [
        ['Receita Total', formatCurrency(totalRevenue)],
        ['Total de Agendamentos', totalAppointments.toString()],
        ['Total de Clientes', totalClients.toString()],
        ['Taxa de Conclusão', `${completionRate}%`],
        ['Taxa de Cancelamento', `${cancellationRate}%`],
        ['Período', periodoTempo],
      ];
      
      const tsvContent = [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n');
      const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_${new Date().toISOString().split('T')[0]}.xls`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (formato === 'word') {
      // Gerar formato de texto para Word
      const content = `
RELATÓRIO DE DESEMPENHO
=======================
Gerado em: ${new Date().toLocaleDateString('pt-BR')}
Período: ${periodoTempo}

RESUMO FINANCEIRO
-----------------
Receita Total: ${formatCurrency(totalRevenue)}

AGENDAMENTOS
------------
Total de Agendamentos: ${totalAppointments}
Taxa de Conclusão: ${completionRate}%
Taxa de Cancelamento: ${cancellationRate}%

CLIENTES
--------
Total de Clientes: ${totalClients}
      `.trim();
      
      const blob = new Blob([content], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_${new Date().toISOString().split('T')[0]}.doc`;
      link.click();
      URL.revokeObjectURL(url);
    }
    
    toast({ title: t('export'), description: `Relatório exportado em ${formatoNomes[formato]}` });
  };

  const handleRefresh = () => {
    refetchSales();
    toast({ title: t('refresh'), description: t('loading') });
  };

  const monthlyRevenue = totalRevenue / 12;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <h1 className="text-2xl font-semibold">{t('reportsTitle')}</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={periodoTempo} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">{t('thisMonth')}</SelectItem>
              <SelectItem value="trimestre">{t('thisQuarter')}</SelectItem>
              <SelectItem value="ano">{t('thisYear')}</SelectItem>
              <SelectItem value="personalizado">{t('customPeriod')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleRefresh}><RefreshCw size={18} className="mr-2" />{t('refresh')}</Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline"><Download size={18} className="mr-2" />{t('export')}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-2">
                <p className="text-sm font-medium mb-3">Exportar como:</p>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => exportarRelatorio('csv')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => exportarRelatorio('excel')}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel (.xls)
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => exportarRelatorio('word')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Word (.doc)
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {showCustomDates && (
        <Card className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-[180px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data de Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-[180px]"
              />
            </div>
            <Button onClick={handleApplyCustomPeriod}>
              <Calendar className="mr-2 h-4 w-4" />
              Aplicar Período
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{t('totalRevenue')}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">{t('yearTotal')}</p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs><linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/><stop offset="95%" stopColor="#0088FE" stopOpacity={0}/></linearGradient></defs>
                  <Area type="monotone" dataKey="receita" stroke="#0088FE" fillOpacity={1} fill="url(#colorReceita)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{t('totalAppointments')}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">{completionRate}% {t('completed')}</p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={appointmentsMonthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs><linearGradient id="colorConcluidos" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/><stop offset="95%" stopColor="#00C49F" stopOpacity={0}/></linearGradient></defs>
                  <Area type="monotone" dataKey="concluidos" stroke="#00C49F" fillOpacity={1} fill="url(#colorConcluidos)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{t('totalClients')}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">{t('registeredClients')}</p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newClientsData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}><Bar dataKey="clientes" fill="#FFBB28" /></BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="receita">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="receita">{t('totalRevenue')}</TabsTrigger>
          <TabsTrigger value="agendamentos">{t('appointments')}</TabsTrigger>
          <TabsTrigger value="servicos">{t('popularServices')}</TabsTrigger>
        </TabsList>
        <TabsContent value="receita" className="pt-4">
          <Card>
            <CardHeader><CardTitle>{t('revenueAnalysis')}</CardTitle><CardDescription>{t('revenueOverview')}</CardDescription></CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="mes" /><YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), t('totalRevenue')]} />
                  <defs><linearGradient id="colorReceitaPrincipal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/><stop offset="95%" stopColor="#0088FE" stopOpacity={0}/></linearGradient></defs>
                  <Area type="monotone" dataKey="receita" stroke="#0088FE" fillOpacity={1} fill="url(#colorReceitaPrincipal)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div><p className="text-sm font-medium">{t('annualRevenue')}</p><p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p></div>
              <div><p className="text-sm font-medium">{t('monthlyAverage')}</p><p className="text-xl font-bold">{formatCurrency(monthlyRevenue)}</p></div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="agendamentos" className="pt-4">
          <Card>
            <CardHeader><CardTitle>{t('appointmentStats')}</CardTitle><CardDescription>{t('appointmentTrends')}</CardDescription></CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentsMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="mes" /><YAxis /><Tooltip /><Legend />
                  <Bar dataKey="concluidos" name={t('confirmed')} stackId="a" fill="#00C49F" />
                  <Bar dataKey="cancelados" name={t('cancelled')} stackId="a" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div><p className="text-sm font-medium">{t('totalAppointments')}</p><p className="text-2xl font-bold">{totalAppointments}</p></div>
              <div><p className="text-sm font-medium">{t('completionRate')}</p><p className="text-xl font-bold">{completionRate}%</p></div>
              <div><p className="text-sm font-medium">{t('cancellationRate')}</p><p className="text-xl font-bold text-amber-500">{cancellationRate}%</p></div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="servicos" className="pt-4">
          <Card>
            <CardHeader><CardTitle>{t('popularServices')}</CardTitle><CardDescription>{t('servicesDistribution')}</CardDescription></CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-center h-[400px]">
              {servicesChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={servicesChartData} cx="50%" cy="50%" labelLine={false} outerRadius={150} fill="#8884d8" dataKey="valor" label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}>
                      {servicesChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, t('totalServices')]} /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (<div className="flex items-center justify-center h-full"><p className="text-muted-foreground">{t('noServicesSold')}</p></div>)}
            </CardContent>
            <CardFooter className="flex justify-around">
              {servicesChartData.length > 0 && (
                <>
                  <div><p className="text-sm font-medium">{t('mostPopular')}</p><p className="text-xl font-bold">{servicesChartData.sort((a, b) => b.valor - a.valor)[0]?.nome}</p></div>
                  <div><p className="text-sm font-medium">{t('totalServices')}</p><p className="text-xl font-bold">{servicesChartData.reduce((sum, service) => sum + service.valor, 0)}</p></div>
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

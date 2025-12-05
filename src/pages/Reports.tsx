import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useReportsData } from '@/features/reports/hooks/useReportsData';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useTranslation } from '@/hooks/useTranslation';

const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9C27B0', '#673AB7'];

const Reports = () => {
  const [periodoTempo, setPeriodoTempo] = useState('ano');
  const { toast } = useToast();
  const { formatCurrency } = useAppSettings();
  const { t } = useTranslation();
  
  const {
    revenueData, appointmentsMonthlyData, servicesChartData, newClientsData,
    totalRevenue, totalAppointments, totalClients, completionRate, cancellationRate, refetchSales
  } = useReportsData(periodoTempo);

  const exportarRelatorio = () => {
    toast({ title: t('export'), description: t('loading') });
  };

  const handleRefresh = () => {
    refetchSales();
    toast({ title: t('refresh'), description: t('loading') });
  };

  const monthlyRevenue = totalRevenue / 12;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">{t('reportsTitle')}</h1>
        <div className="flex gap-4">
          <Select value={periodoTempo} onValueChange={setPeriodoTempo}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">{t('thisMonth')}</SelectItem>
              <SelectItem value="trimestre">{t('thisQuarter')}</SelectItem>
              <SelectItem value="ano">{t('thisYear')}</SelectItem>
              <SelectItem value="personalizado">{t('customPeriod')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh}><RefreshCw size={18} className="mr-2" />{t('refresh')}</Button>
          <Button variant="outline" onClick={exportarRelatorio}><Download size={18} className="mr-2" />{t('export')}</Button>
        </div>
      </div>

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

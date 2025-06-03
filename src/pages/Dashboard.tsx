import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, Calendar, Package, ArrowUp, ArrowDown, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const schema = z.object({
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  servico: z.string().min(1, 'Serviço é obrigatório'),
  data: z.date({
    required_error: "Data é obrigatória",
  }),
  hora: z.string().min(1, 'Hora é obrigatória'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  notificacao: z.array(z.enum(['email', 'whatsapp'])).optional(),
  googleCalendar: z.boolean().optional()
});

type FormValues = z.infer<typeof schema>;

const StatCard = ({ title, value, icon, trend, percentage }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  percentage?: string;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
            
            {percentage && (
              <div className="flex items-center mt-1">
                {trend === 'up' && (
                  <ArrowUp className="text-green-500 mr-1" size={16} />
                )}
                {trend === 'down' && (
                  <ArrowDown className="text-red-500 mr-1" size={16} />
                )}
                <span className={`text-xs ${
                  trend === 'up' ? 'text-green-500' : 
                  trend === 'down' ? 'text-red-500' : ''
                }`}>
                  {percentage} comparado ao mês anterior
                </span>
              </div>
            )}
          </div>
          <div className="p-2 bg-accent rounded-md">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AppointmentItem = ({ client, service, time, status }: {
  client: string;
  service: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}) => {
  const statusClass = 
    status === 'completed' ? 'bg-green-500/20 text-green-600' :
    status === 'cancelled' ? 'bg-red-500/20 text-red-600' :
    'bg-yellow-500/20 text-yellow-600';

  const statusText = 
    status === 'completed' ? 'Concluído' :
    status === 'cancelled' ? 'Cancelado' :
    'Agendado';

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="font-medium">{client}</p>
        <p className="text-sm text-muted-foreground">{service}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">{time}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cliente: '',
      servico: '',
      hora: '',
      telefone: '',
      email: '',
      notificacao: [],
      googleCalendar: false
    }
  });

  // Buscar estatísticas reais do usuário
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const [
        { count: clientCount },
        { count: appointmentCount },
        { count: inventoryCount },
        { data: salesData }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('inventory').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('sales').select('total').eq('user_id', user.id)
      ]);

      const totalRevenue = salesData?.reduce((sum, sale) => sum + Number(sale.total), 0) || 0;

      return {
        clients: clientCount || 0,
        appointments: appointmentCount || 0,
        inventory: inventoryCount || 0,
        revenue: totalRevenue
      };
    },
  });

  // Buscar agendamentos de hoje
  const { data: todayAppointments = [] } = useQuery({
    queryKey: ['today-appointments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          title,
          description,
          start_time,
          status,
          clients (name)
        `)
        .eq('user_id', user.id)
        .gte('start_time', startOfDay)
        .lte('start_time', endOfDay)
        .order('start_time');

      if (error) throw error;

      return data?.map(appointment => ({
        id: appointment.id,
        client: appointment.clients?.name || 'Cliente não identificado',
        service: appointment.title,
        time: format(new Date(appointment.start_time), 'HH:mm'),
        status: appointment.status as 'scheduled' | 'completed' | 'cancelled'
      })) || [];
    },
  });

  // Buscar alertas de estoque baixo
  const { data: lowStockItems = [] } = useQuery({
    queryKey: ['low-stock-alerts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('inventory')
        .select('id, name, stock, threshold')
        .eq('user_id', user.id)
        .or('stock.lte.threshold,stock.eq.0')
        .order('stock');

      if (error) throw error;

      return data || [];
    },
  });
  
  const onSubmit = (data: FormValues) => {
    try {
      // Simulação da integração com Google Calendar
      if (data.googleCalendar) {
        console.log('Adicionando ao Google Calendar:', data);
      }
      
      // Simulação de envio de notificações
      if (data.notificacao?.includes('email')) {
        console.log('Enviando notificação por email para:', data.email);
      }
      
      if (data.notificacao?.includes('whatsapp')) {
        console.log('Enviando notificação por WhatsApp para:', data.telefone);
      }
      
      toast({
        title: "Agendamento criado com sucesso!",
        description: `${data.cliente} agendado para ${format(data.data, 'dd/MM/yyyy')} às ${data.hora}`,
      });
      
      setOpenDialog(false);
      form.reset();
    } catch (error) {
      console.error('Erro ao agendar:', error);
      toast({
        title: "Erro ao agendar",
        description: "Ocorreu um erro ao criar o agendamento.",
        variant: "destructive"
      });
    }
  };

  if (isLoadingStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total de Clientes"
          value={stats?.clients.toString() || "0"}
          icon={<Users size={20} className="text-primary" />}
          trend="neutral"
        />
        <StatCard 
          title="Agendamentos"
          value={stats?.appointments.toString() || "0"}
          icon={<Calendar size={20} className="text-primary" />}
          trend="neutral"
        />
        <StatCard 
          title="Itens em Estoque"
          value={stats?.inventory.toString() || "0"}
          icon={<Package size={20} className="text-primary" />}
          trend="neutral"
        />
        <StatCard 
          title="Faturamento Total"
          value={`R$ ${stats?.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || "0,00"}`}
          icon={<BarChart size={20} className="text-primary" />}
          trend="neutral"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Agendamentos de Hoje</CardTitle>
            <Button onClick={() => setOpenDialog(true)}>Novo Agendamento</Button>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nenhum agendamento para hoje</p>
            ) : (
              <div className="space-y-0">
                {todayAppointments.map((appointment) => (
                  <AppointmentItem 
                    key={appointment.id}
                    client={appointment.client}
                    service={appointment.service}
                    time={appointment.time}
                    status={appointment.status}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Alertas de Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nenhum alerta de estoque</p>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className={`p-3 border rounded-md ${
                    item.stock === 0 
                      ? 'bg-red-500/10 border-red-500/20' 
                      : 'bg-yellow-500/10 border-yellow-500/20'
                  }`}>
                    <p className={`font-medium ${
                      item.stock === 0 ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {item.stock === 0 ? 'Produto Esgotado' : 'Estoque Baixo'}
                    </p>
                    <p className="text-sm mt-1">
                      {item.name} - {item.stock === 0 ? 'Sem estoque' : `${item.stock} itens restantes`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>
              Crie um novo agendamento para um cliente.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="servico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serviço</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="piercing_industrial">Piercing Industrial</SelectItem>
                        <SelectItem value="piercing_helix">Piercing Helix</SelectItem>
                        <SelectItem value="piercing_septum">Piercing Septum</SelectItem>
                        <SelectItem value="piercing_labret">Piercing Labret</SelectItem>
                        <SelectItem value="piercing_tragus">Piercing Tragus</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="09:00">09:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="11:00">11:00</SelectItem>
                          <SelectItem value="13:00">13:00</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="15:00">15:00</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                          <SelectItem value="17:00">17:00</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
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
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <FormLabel className="mb-0">Notificações:</FormLabel>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="email-notification" 
                        className="w-4 h-4"
                        onChange={(e) => {
                          const current = form.getValues('notificacao') || [];
                          if (e.target.checked) {
                            form.setValue('notificacao', [...current, 'email']);
                          } else {
                            form.setValue('notificacao', current.filter(item => item !== 'email'));
                          }
                        }} 
                      />
                      <Mail size={16} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notificar por Email</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="whatsapp-notification" 
                        className="w-4 h-4"
                        onChange={(e) => {
                          const current = form.getValues('notificacao') || [];
                          if (e.target.checked) {
                            form.setValue('notificacao', [...current, 'whatsapp']);
                          } else {
                            form.setValue('notificacao', current.filter(item => item !== 'whatsapp'));
                          }
                        }} 
                      />
                      <MessageSquare size={16} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notificar por WhatsApp</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="google-calendar" 
                        className="w-4 h-4"
                        onChange={(e) => form.setValue('googleCalendar', e.target.checked)} 
                      />
                      <Calendar size={16} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adicionar ao Google Agenda</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
                <Button type="submit">Agendar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

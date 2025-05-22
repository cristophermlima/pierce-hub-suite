
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Clock, Calendar as CalendarIcon, Mail, MessageSquare, MapPin, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Combobox } from '@/components/ui/combobox';

const formSchema = z.object({
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  servico: z.string().min(1, 'Serviço é obrigatório'),
  data: z.date({
    required_error: "Data é obrigatória",
  }),
  hora: z.string().min(1, 'Hora é obrigatória'),
  localizacao: z.string().optional(),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  lembrete: z.array(z.enum(['email', 'whatsapp', 'google'])).optional(),
  antecedencia: z.string().optional(),
  observacoes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Serviços predefinidos
const servicosPredefinidos = [
  { label: "Piercing Industrial", value: "piercing_industrial" },
  { label: "Piercing Helix", value: "piercing_helix" },
  { label: "Piercing Septum", value: "piercing_septum" },
  { label: "Piercing Labret", value: "piercing_labret" },
  { label: "Piercing Tragus", value: "piercing_tragus" }
];

// Horários disponíveis
const horariosDisponiveis = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

// Interface para os agendamentos
interface Appointment {
  id: string;
  title: string;
  client_id: string | null;
  start_time: string;
  end_time: string;
  description?: string;
  status?: string;
  client_name?: string;
  client_avatar?: string;
}

// Interface para os clientes
interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string;
}

const Appointments = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customService, setCustomService] = useState('');
  const [availableClients, setAvailableClients] = useState<{ label: string; value: string }[]>([]);
  const queryClient = useQueryClient();

  // Buscar clientes para o combobox
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, name, phone, email')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          const clientOptions = data.map((client: Client) => ({
            label: client.name,
            value: client.id,
            phone: client.phone,
            email: client.email || '',
          }));
          setAvailableClients(clientOptions);
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        toast.error('Não foi possível carregar a lista de clientes');
      }
    };

    fetchClients();
  }, []);

  // Query para buscar agendamentos do dia selecionado
  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['appointments', date ? format(date, 'yyyy-MM-dd') : ''],
    queryFn: async () => {
      if (!date) return [];

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (
            id,
            name
          )
        `)
        .gte('start_time', startOfDay.toISOString())
        .lt('start_time', endOfDay.toISOString())
        .order('start_time');

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        throw new Error('Falha ao carregar agendamentos');
      }

      // Formatando os agendamentos com o nome do cliente
      return data.map((appointment: any) => ({
        ...appointment,
        client_name: appointment.clients?.name || 'Cliente não informado',
        client_avatar: appointment.clients?.name.substring(0, 2).toUpperCase() || 'CL',
      }));
    },
    enabled: !!date,
  });

  // Mutation para criar agendamento
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento criado com sucesso');
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error('Erro ao criar agendamento:', error);
      toast.error('Falha ao criar agendamento');
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: '',
      servico: '',
      hora: '',
      localizacao: '',
      telefone: '',
      email: '',
      lembrete: [],
      antecedencia: '30',
      observacoes: '',
    }
  });

  // Função auxiliar para manipular a seleção do cliente e preencher os campos
  const handleClientSelection = (clientId: string) => {
    const selectedClient = availableClients.find(client => client.value === clientId);
    if (selectedClient) {
      form.setValue('cliente', clientId);
      form.setValue('telefone', selectedClient.phone || '');
      form.setValue('email', selectedClient.email || '');
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Formatando a hora para ISO String
      const appointmentDate = data.data;
      const [hours, minutes] = data.hora.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // Calculando o horário de fim (1 hora após o início)
      const endTime = new Date(appointmentDate);
      endTime.setHours(endTime.getHours() + 1);
      
      // Preparando os dados para o agendamento
      const appointmentData = {
        title: `${servicosPredefinidos.find(s => s.value === data.servico)?.label || customService || data.servico}`,
        description: data.observacoes,
        client_id: data.cliente,
        start_time: appointmentDate.toISOString(),
        end_time: endTime.toISOString(),
        status: 'scheduled'
      };
      
      // Criando o agendamento
      await createAppointmentMutation.mutateAsync(appointmentData);
      
      // Simulação de envio de lembretes
      if (data.lembrete?.includes('email')) {
        console.log('Enviando lembrete por email para:', data.email);
        toast.info(`Lembrete será enviado para ${data.email}`);
      }
      
      if (data.lembrete?.includes('whatsapp')) {
        console.log('Enviando lembrete por WhatsApp para:', data.telefone);
        toast.info(`Lembrete WhatsApp será enviado para ${data.telefone}`);
      }
      
      // Reset do formulário
      form.reset();
      setCustomService('');
    } catch (error) {
      console.error('Erro ao processar agendamento:', error);
      toast.error('Falha ao processar agendamento');
    }
  };

  // Formatadores de data
  const formatDay = (date: Date) => {
    return format(date, 'd', { locale: ptBR });
  };

  const formatWeekday = (date: Date) => {
    return format(date, 'EEEE', { locale: ptBR });
  };

  const formatMonth = (date: Date) => {
    return format(date, 'MMMM yyyy', { locale: ptBR });
  };

  // Renderização de horário no formato 24h
  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'HH:mm');
    } catch (error) {
      console.error('Erro ao formatar horário:', error);
      return '--:--';
    }
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
            <CardDescription>Selecione uma data para ver os agendamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              locale={ptBR}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {date && formatWeekday(date)}
            </CardTitle>
            <CardDescription>
              {date && formatDay(date)} de {date && formatMonth(date)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Carregando agendamentos...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {appointmentsData && appointmentsData.length > 0 ? (
                  appointmentsData.map((appointment: Appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" alt={appointment.client_name} />
                          <AvatarFallback>{appointment.client_avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">{appointment.client_name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(appointment.start_time)} - {appointment.title}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Detalhes</Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    Nenhum agendamento para esta data.
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setDialogOpen(true)}>Novo Agendamento</Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>
              Agende um novo cliente e configure lembretes automáticos.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Combobox
                        options={availableClients}
                        value={field.value}
                        onChange={(value) => handleClientSelection(value)}
                        placeholder="Selecione um cliente..."
                      />
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
                    <div className="flex flex-col gap-2">
                      <Select 
                        onValueChange={(value) => {
                          if (value === 'outro') {
                            form.setValue('servico', customService);
                          } else {
                            field.onChange(value);
                            setCustomService('');
                          }
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {servicosPredefinidos.map((servico) => (
                            <SelectItem key={servico.value} value={servico.value}>
                              {servico.label}
                            </SelectItem>
                          ))}
                          <SelectItem value="outro">Outro (digite abaixo)</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {(field.value === 'outro' || field.value === customService) && (
                        <Input 
                          placeholder="Informe o serviço personalizado" 
                          value={customService}
                          onChange={(e) => {
                            setCustomService(e.target.value);
                            form.setValue('servico', e.target.value);
                          }}
                          className="mt-2"
                        />
                      )}
                    </div>
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
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3"
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
                          {horariosDisponiveis.map((hora) => (
                            <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="localizacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input 
                          placeholder="Endereço do atendimento" 
                          {...field} 
                          className="rounded-r-none"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="rounded-l-none border-l-0" 
                          onClick={() => {
                            // Simulação de obtenção da localização atual
                            field.onChange("Av. Paulista, 1000 - São Paulo, SP");
                            toast.info("Localização definida");
                          }}
                        >
                          <MapPin size={16} />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Opcional. Informe o local do atendimento ou clique no ícone para usar a localização atual.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (WhatsApp)</FormLabel>
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
              
              <div className="flex flex-col space-y-2">
                <FormLabel>Lembretes e integrações</FormLabel>
                <div className="flex flex-wrap gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 border p-2 rounded">
                        <Checkbox 
                          id="email-notification"
                          onCheckedChange={(checked) => {
                            const current = form.getValues('lembrete') || [];
                            if (checked) {
                              form.setValue('lembrete', [...current, 'email']);
                            } else {
                              form.setValue('lembrete', current.filter(item => item !== 'email'));
                            }
                          }}
                        />
                        <label
                          htmlFor="email-notification"
                          className="text-sm font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Mail size={16} />
                          <span>Email</span>
                        </label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enviar lembrete por Email</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 border p-2 rounded">
                        <Checkbox 
                          id="whatsapp-notification"
                          onCheckedChange={(checked) => {
                            const current = form.getValues('lembrete') || [];
                            if (checked) {
                              form.setValue('lembrete', [...current, 'whatsapp']);
                            } else {
                              form.setValue('lembrete', current.filter(item => item !== 'whatsapp'));
                            }
                          }}
                        />
                        <label
                          htmlFor="whatsapp-notification"
                          className="text-sm font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare size={16} />
                          <span>WhatsApp</span>
                        </label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enviar lembrete por WhatsApp</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 border p-2 rounded">
                        <Checkbox 
                          id="google-calendar"
                          onCheckedChange={(checked) => {
                            const current = form.getValues('lembrete') || [];
                            if (checked) {
                              form.setValue('lembrete', [...current, 'google']);
                            } else {
                              form.setValue('lembrete', current.filter(item => item !== 'google'));
                            }
                          }}
                        />
                        <label
                          htmlFor="google-calendar"
                          className="text-sm font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <CalendarIcon size={16} />
                          <span>Google Agenda</span>
                        </label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adicionar ao Google Agenda</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="antecedencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enviar lembrete com antecedência de</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a antecedência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                        <SelectItem value="1440">1 dia</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Input placeholder="Instruções ou observações adicionais (opcional)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={createAppointmentMutation.isPending}>
                  {createAppointmentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Confirmar Agendamento'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Appointments;

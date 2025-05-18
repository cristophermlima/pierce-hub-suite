
import React, { useState } from 'react';
import { format } from 'date-fns';
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
import { toast } from "@/hooks/use-toast";
import { Clock, Calendar as CalendarIcon, Mail, MessageSquare, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

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

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const appointments = [
    { id: 1, client: 'Ana Silva', time: '09:00', service: 'Piercing Labret', avatar: 'AS' },
    { id: 2, client: 'Carlos Oliveira', time: '11:30', service: 'Piercing Septum', avatar: 'CO' },
    { id: 3, client: 'Mariana Santos', time: '14:00', service: 'Piercing Industrial', avatar: 'MS' },
    { id: 4, client: 'Rafael Lima', time: '16:30', service: 'Piercing Helix', avatar: 'RL' },
  ];

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

  const onSubmit = (data: FormValues) => {
    console.log('Dados do agendamento:', data);
    
    // Simulação da integração com Google Agenda
    if (data.lembrete?.includes('google')) {
      console.log('Adicionando ao Google Agenda:', {
        summary: `${data.servico} - ${data.cliente}`,
        location: data.localizacao,
        start: {
          dateTime: `${format(data.data, 'yyyy-MM-dd')}T${data.hora}:00`,
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: `${format(data.data, 'yyyy-MM-dd')}T${addHours(data.hora, 1)}:00`,
          timeZone: 'America/Sao_Paulo',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: Number(data.antecedencia) || 30 },
          ],
        },
      });
    }
    
    // Simulação do envio de lembretes
    if (data.lembrete?.includes('email')) {
      console.log('Enviando lembrete por email para:', data.email);
      // Implementação real utilizaria uma API de email
    }
    
    if (data.lembrete?.includes('whatsapp')) {
      console.log('Enviando lembrete por WhatsApp para:', data.telefone);
      // Simulação da integração com API oficial do WhatsApp
      console.log('Mensagem WhatsApp:', `Olá ${data.cliente}, você tem um agendamento de ${data.servico} em ${format(data.data, 'dd/MM/yyyy')} às ${data.hora}.`);
    }

    toast({
      title: "Agendamento confirmado",
      description: `Agendamento de ${data.servico} para ${data.cliente} em ${format(data.data, 'dd/MM/yyyy')} às ${data.hora}`,
    });

    setDialogOpen(false);
    form.reset();
  };

  const formatDay = (date: Date) => {
    return format(date, 'd', { locale: ptBR });
  };

  const formatWeekday = (date: Date) => {
    return format(date, 'EEEE', { locale: ptBR });
  };

  const formatMonth = (date: Date) => {
    return format(date, 'MMMM yyyy', { locale: ptBR });
  };

  // Função auxiliar para adicionar horas a um horário
  const addHours = (timeString: string, hoursToAdd: number) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newHours = (hours + hoursToAdd) % 24;
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
            <div className="space-y-4">
              {appointments.map(appointment => (
                <div key={appointment.id} className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={appointment.client} />
                      <AvatarFallback>{appointment.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-medium">{appointment.client}</h4>
                      <p className="text-xs text-muted-foreground">{appointment.time} - {appointment.service}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Detalhes</Button>
                </div>
              ))}
            </div>
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
                            toast({
                              title: "Localização definida",
                              description: "Endereço atual adicionado.",
                            });
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
                <Button type="submit">Confirmar Agendamento</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Appointments;

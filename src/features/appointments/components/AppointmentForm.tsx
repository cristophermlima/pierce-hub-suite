import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, MapPin, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  appointmentFormSchema, 
  AppointmentFormValues, 
  horariosDisponiveis
} from '../types';

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormValues) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const AppointmentForm = ({
  onSubmit,
  onCancel,
  isSubmitting
}: AppointmentFormProps) => {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientName: '',
      servico: '',
      data: new Date(),
      hora: '',
      localizacao: '',
      telefone: '',
      email: '',
      lembrete: [],
      antecedencia: '30',
      observacoes: '',
    }
  });

  const handleFormSubmit = async (data: AppointmentFormValues) => {
    const success = await onSubmit(data);
    if (success) {
      form.reset();
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Novo Agendamento</DialogTitle>
        <DialogDescription>
          Agende um novo cliente e configure lembretes automáticos.
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome do cliente"
                    {...field}
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
                <FormControl>
                  <Input
                    placeholder="Digite o serviço de body piercing"
                    {...field}
                  />
                </FormControl>
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
                        locale={ptBR}
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
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
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
    </>
  );
};

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Control, UseFormSetValue } from "react-hook-form";
import { AppointmentFormValues } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

interface ClientSectionProps {
  control: Control<AppointmentFormValues>;
  setValue: UseFormSetValue<AppointmentFormValues>;
}

export const ClientSection = ({ control, setValue }: ClientSectionProps) => {
  const [isNewClient, setIsNewClient] = useState(false);

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // RLS gerencia acesso - sem filtro de user_id
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, phone')
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  if (isNewClient) {
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Novo Cliente</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsNewClient(false)}
          >
            Selecionar existente
          </Button>
        </div>
        
        <FormField
          control={control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone (WhatsApp) *</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
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
        
        <FormDescription>
          O cliente será criado automaticamente ao salvar o agendamento
        </FormDescription>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                const selectedClient = clients.find(c => c.id === value);
                if (selectedClient) {
                  setValue('clientName', selectedClient.name);
                  setValue('telefone', selectedClient.phone || '');
                  setValue('email', selectedClient.email || '');
                }
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} {client.email && `(${client.email})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          setIsNewClient(true);
          setValue('clientId', '');
          setValue('clientName', '');
          setValue('telefone', '');
          setValue('email', '');
        }}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Criar Novo Cliente
      </Button>
    </div>
  );
};

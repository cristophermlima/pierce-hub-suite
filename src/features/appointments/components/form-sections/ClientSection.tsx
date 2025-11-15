import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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

interface ClientSectionProps {
  control: Control<AppointmentFormValues>;
  setValue: UseFormSetValue<AppointmentFormValues>;
}

export const ClientSection = ({ control, setValue }: ClientSectionProps) => {
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, phone')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  return (
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
  );
};

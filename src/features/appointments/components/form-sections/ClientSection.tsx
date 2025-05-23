
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { AppointmentFormValues } from "../../types";

interface ClientSectionProps {
  control: Control<AppointmentFormValues>;
}

export const ClientSection = ({ control }: ClientSectionProps) => {
  return (
    <FormField
      control={control}
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
  );
};

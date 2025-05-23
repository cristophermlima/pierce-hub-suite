
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { AppointmentFormValues } from "../../types";

interface ServiceSectionProps {
  control: Control<AppointmentFormValues>;
}

export const ServiceSection = ({ control }: ServiceSectionProps) => {
  return (
    <FormField
      control={control}
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
  );
};

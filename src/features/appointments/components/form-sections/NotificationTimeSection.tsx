
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { AppointmentFormValues } from "../../types";

interface NotificationTimeSectionProps {
  control: Control<AppointmentFormValues>;
}

export const NotificationTimeSection = ({ control }: NotificationTimeSectionProps) => {
  return (
    <FormField
      control={control}
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
  );
};

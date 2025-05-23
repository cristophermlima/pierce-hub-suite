
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { AppointmentFormValues } from "../../types";

interface NotesSectionProps {
  control: Control<AppointmentFormValues>;
}

export const NotesSection = ({ control }: NotesSectionProps) => {
  return (
    <FormField
      control={control}
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
  );
};

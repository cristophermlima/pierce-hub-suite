
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { AppointmentFormValues } from "../../types";

interface ContactSectionProps {
  control: Control<AppointmentFormValues>;
}

export const ContactSection = ({ control }: ContactSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
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
  );
};

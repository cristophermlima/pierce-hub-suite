
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { Control } from "react-hook-form";
import { AppointmentFormValues } from "../../types";

interface LocationSectionProps {
  control: Control<AppointmentFormValues>;
}

export const LocationSection = ({ control }: LocationSectionProps) => {
  return (
    <FormField
      control={control}
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
  );
};

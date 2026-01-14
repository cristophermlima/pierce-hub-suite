
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
                onClick={async () => {
                  if (!navigator.geolocation) {
                    toast.error("Geolocalização não suportada pelo navegador");
                    return;
                  }
                  
                  toast.info("Obtendo localização...");
                  
                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      const { latitude, longitude } = position.coords;
                      
                      try {
                        // Use Nominatim (OpenStreetMap) for reverse geocoding - free and no API key needed
                        const response = await fetch(
                          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                          {
                            headers: {
                              'Accept-Language': 'pt-BR'
                            }
                          }
                        );
                        
                        if (response.ok) {
                          const data = await response.json();
                          const address = data.display_name || `${latitude}, ${longitude}`;
                          field.onChange(address);
                          toast.success("Localização obtida!");
                        } else {
                          // Fallback to coordinates
                          field.onChange(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                          toast.info("Localização definida (coordenadas)");
                        }
                      } catch (error) {
                        // Fallback to coordinates on error
                        field.onChange(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                        toast.info("Localização definida (coordenadas)");
                      }
                    },
                    (error) => {
                      console.error("Erro de geolocalização:", error);
                      if (error.code === error.PERMISSION_DENIED) {
                        toast.error("Permissão de localização negada");
                      } else if (error.code === error.POSITION_UNAVAILABLE) {
                        toast.error("Localização indisponível");
                      } else if (error.code === error.TIMEOUT) {
                        toast.error("Tempo esgotado ao obter localização");
                      } else {
                        toast.error("Erro ao obter localização");
                      }
                    },
                    {
                      enableHighAccuracy: true,
                      timeout: 10000,
                      maximumAge: 60000
                    }
                  );
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

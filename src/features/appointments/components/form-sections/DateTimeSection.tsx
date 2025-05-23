
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Control } from "react-hook-form";
import { AppointmentFormValues, horariosDisponiveis } from "../../types";

interface DateTimeSectionProps {
  control: Control<AppointmentFormValues>;
}

export const DateTimeSection = ({ control }: DateTimeSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
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
        control={control}
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
  );
};

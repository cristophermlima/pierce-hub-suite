
import { FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Mail, MessageSquare, CalendarIcon } from "lucide-react";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { AppointmentFormValues } from "../../types";

interface ReminderSectionProps {
  setValue: UseFormSetValue<AppointmentFormValues>;
  getValues: UseFormGetValues<AppointmentFormValues>;
}

export const ReminderSection = ({ setValue, getValues }: ReminderSectionProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <FormLabel>Lembretes e integrações</FormLabel>
      <div className="flex flex-wrap gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2 border p-2 rounded">
              <Checkbox 
                id="email-notification"
                onCheckedChange={(checked) => {
                  const current = getValues('lembrete') || [];
                  if (checked) {
                    setValue('lembrete', [...current, 'email']);
                  } else {
                    setValue('lembrete', current.filter(item => item !== 'email'));
                  }
                }}
              />
              <label
                htmlFor="email-notification"
                className="text-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                <Mail size={16} />
                <span>Email</span>
              </label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enviar lembrete por Email</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2 border p-2 rounded">
              <Checkbox 
                id="whatsapp-notification"
                onCheckedChange={(checked) => {
                  const current = getValues('lembrete') || [];
                  if (checked) {
                    setValue('lembrete', [...current, 'whatsapp']);
                  } else {
                    setValue('lembrete', current.filter(item => item !== 'whatsapp'));
                  }
                }}
              />
              <label
                htmlFor="whatsapp-notification"
                className="text-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                <MessageSquare size={16} />
                <span>WhatsApp</span>
              </label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enviar lembrete por WhatsApp</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2 border p-2 rounded">
              <Checkbox 
                id="google-calendar"
                onCheckedChange={(checked) => {
                  const current = getValues('lembrete') || [];
                  if (checked) {
                    setValue('lembrete', [...current, 'google']);
                  } else {
                    setValue('lembrete', current.filter(item => item !== 'google'));
                  }
                }}
              />
              <label
                htmlFor="google-calendar"
                className="text-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                <CalendarIcon size={16} />
                <span>Google Agenda</span>
              </label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Adicionar ao Google Agenda</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

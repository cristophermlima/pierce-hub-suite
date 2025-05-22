
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Appointment } from '../types';

interface AppointmentListProps {
  appointments: Appointment[] | undefined;
  isLoading: boolean;
  date: Date | undefined;
  formatWeekday: (date: Date) => string;
  formatDay: (date: Date) => string;
  formatMonth: (date: Date) => string;
  onNewAppointment: () => void;
}

export const AppointmentList = ({
  appointments,
  isLoading,
  date,
  formatWeekday,
  formatDay,
  formatMonth,
  onNewAppointment
}: AppointmentListProps) => {
  // Format time in 24h format
  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'HH:mm');
    } catch (error) {
      console.error('Erro ao formatar horário:', error);
      return '--:--';
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-2xl font-semibold">
            {date && formatWeekday(date)}
          </h3>
          <p className="text-sm text-muted-foreground">
            {date && `${formatDay(date)} de ${formatMonth(date)}`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Carregando agendamentos...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments && appointments.length > 0 ? (
            appointments.map((appointment: Appointment) => (
              <div key={appointment.id} className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={appointment.client_name} />
                    <AvatarFallback>{appointment.client_avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium">{appointment.client_name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(appointment.start_time)} - {appointment.title}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Detalhes</Button>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground p-4">
              Nenhum agendamento para esta data.
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4">
        <Button className="w-full" onClick={onNewAppointment}>
          Novo Agendamento
        </Button>
      </div>
    </>
  );
};

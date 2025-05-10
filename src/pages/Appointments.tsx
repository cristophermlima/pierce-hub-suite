
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const appointments = [
    { id: 1, client: 'Ana Silva', time: '09:00', service: 'Piercing Labret', avatar: 'AS' },
    { id: 2, client: 'Carlos Oliveira', time: '11:30', service: 'Piercing Septum', avatar: 'CO' },
    { id: 3, client: 'Mariana Santos', time: '14:00', service: 'Piercing Industrial', avatar: 'MS' },
    { id: 4, client: 'Rafael Lima', time: '16:30', service: 'Piercing Helix', avatar: 'RL' },
  ];

  const formatDay = (date: Date) => {
    return format(date, 'd', { locale: ptBR });
  };

  const formatWeekday = (date: Date) => {
    return format(date, 'EEEE', { locale: ptBR });
  };

  const formatMonth = (date: Date) => {
    return format(date, 'MMMM yyyy', { locale: ptBR });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
          <CardDescription>Selecione uma data para ver os agendamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            locale={ptBR}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {date && formatWeekday(date)}
          </CardTitle>
          <CardDescription>
            {date && formatDay(date)} de {date && formatMonth(date)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map(appointment => (
              <div key={appointment.id} className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={appointment.client} />
                    <AvatarFallback>{appointment.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium">{appointment.client}</h4>
                    <p className="text-xs text-muted-foreground">{appointment.time} - {appointment.service}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Detalhes</Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Novo Agendamento</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Appointments;

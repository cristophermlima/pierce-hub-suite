
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ptBR } from 'date-fns/locale';

import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import { AppointmentForm } from '@/features/appointments/components/AppointmentForm';
import { AppointmentList } from '@/features/appointments/components/AppointmentList';
import { formatDay, formatMonth, formatWeekday } from '@/features/appointments/utils/dateFormatters';

const Appointments = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    date,
    setDate,
    appointmentsData,
    isLoading,
    createAppointmentMutation,
    handleAppointmentSubmit
  } = useAppointments();

  // Handle form submission
  const onSubmit = async (data: any) => {
    const success = await handleAppointmentSubmit(data);
    if (success) {
      setDialogOpen(false);
    }
    return success;
  };

  return (
    <>
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
            <CardTitle>Agendamentos</CardTitle>
            <CardDescription>Horários agendados para o dia selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentList
              appointments={appointmentsData}
              isLoading={isLoading}
              date={date}
              formatWeekday={formatWeekday}
              formatDay={formatDay}
              formatMonth={formatMonth}
              onNewAppointment={() => setDialogOpen(true)}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <AppointmentForm
            onSubmit={onSubmit}
            onCancel={() => setDialogOpen(false)}
            isSubmitting={createAppointmentMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Appointments;

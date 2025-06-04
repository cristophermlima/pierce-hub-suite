
import React from 'react';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import { AppointmentForm } from '@/features/appointments/components/AppointmentForm';
import { AppointmentList } from '@/features/appointments/components/AppointmentList';

const Appointments = () => {
  const {
    appointments,
    isLoading,
    selectedAppointment,
    setSelectedAppointment,
    isFormOpen,
    setIsFormOpen,
    formData,
    setFormData,
    handleSave,
    handleDelete,
    isSaving
  } = useAppointments();

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Lista de agendamentos - responsiva */}
      <div className="w-full lg:w-1/2 xl:w-2/3">
        <div className="bg-card rounded-lg border p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Agenda</h1>
            <button
              onClick={() => {
                setSelectedAppointment(null);
                setIsFormOpen(true);
              }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Novo Agendamento
            </button>
          </div>
          
          <div className="h-[calc(100vh-200px)] overflow-y-auto">
            <AppointmentList
              appointments={appointments}
              isLoading={isLoading}
              onEdit={(appointment) => {
                setSelectedAppointment(appointment);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* Formulário - responsivo com scroll */}
      <div className="w-full lg:w-1/2 xl:w-1/3">
        <div className="bg-card rounded-lg border h-full">
          {isFormOpen ? (
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1 ml-auto"
                >
                  ✕
                </button>
              </div>
              
              {/* Formulário com scroll */}
              <div className="flex-1 overflow-y-auto pr-2">
                <AppointmentForm
                  appointment={selectedAppointment}
                  formData={formData}
                  setFormData={setFormData}
                  onSave={handleSave}
                  onCancel={() => setIsFormOpen(false)}
                  isSaving={isSaving}
                />
              </div>
            </div>
          ) : (
            <div className="p-6 h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg mb-2">Selecione um agendamento</p>
                <p className="text-sm">ou crie um novo para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;

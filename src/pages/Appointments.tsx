
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Calendar,
  CalendarControls,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeading,
  CalendarMonthValue,
  CalendarYearValue,
} from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AppointmentType {
  id: string;
  client: string;
  service: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const mockAppointments: AppointmentType[] = [
  {
    id: '1',
    client: 'Gabriel Santos',
    service: 'Industrial Piercing',
    time: '10:00 AM',
    duration: '45 min',
    status: 'scheduled',
  },
  {
    id: '2',
    client: 'Maria Oliveira',
    service: 'Septum Piercing',
    time: '11:30 AM',
    duration: '30 min',
    status: 'completed',
  },
  {
    id: '3',
    client: 'Lucas Silva',
    service: 'Helix Piercing',
    time: '1:15 PM',
    duration: '30 min',
    status: 'scheduled',
  },
  {
    id: '4',
    client: 'Ana Costa',
    service: 'Tragus Piercing',
    time: '3:30 PM',
    duration: '45 min',
    status: 'cancelled',
  },
  {
    id: '5',
    client: 'João Melo',
    service: 'Eyebrow Piercing',
    time: '4:45 PM',
    duration: '30 min',
    status: 'scheduled',
  }
];

const mockTimeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', 
  '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
  '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM'
];

const mockClients = [
  'Gabriel Santos', 'Maria Oliveira', 'Lucas Silva', 'Ana Costa',
  'João Melo', 'Fernanda Lima', 'Ricardo Souza', 'Camila Pereira'
];

const mockServices = [
  'Ear Lobe', 'Industrial', 'Helix', 'Tragus', 'Daith',
  'Septum', 'Nostril', 'Labret', 'Eyebrow', 'Naval'
];

const AppointmentItem = ({ appointment }: { appointment: AppointmentType }) => {
  const statusClass = 
    appointment.status === 'completed' ? 'bg-green-500/20 text-green-600' :
    appointment.status === 'cancelled' ? 'bg-red-500/20 text-red-600' :
    'bg-yellow-500/20 text-yellow-600';

  return (
    <div className="mb-3 p-3 bg-accent rounded-md">
      <div className="flex justify-between items-start mb-2">
        <p className="font-medium">{appointment.client}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{appointment.service}</p>
      <div className="flex justify-between mt-2 text-sm">
        <span>{appointment.time}</span>
        <span>{appointment.duration}</span>
      </div>
    </div>
  );
};

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddAppointment = () => {
    setIsDialogOpen(true);
  };

  const handleSaveAppointment = () => {
    toast({
      title: "Appointment scheduled",
      description: "The appointment has been scheduled successfully.",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="grid gap-6 md:grid-cols-7">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
          />
          <Button 
            className="w-full mt-4"
            onClick={handleAddAppointment}
          >
            <Plus size={18} className="mr-2" />
            Add Appointment
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              Appointments for {date?.toLocaleDateString('pt-BR', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </CardTitle>
            <CardDescription>
              Manage your appointments for the selected day
            </CardDescription>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {mockAppointments.length > 0 ? (
              mockAppointments.map((appointment) => (
                <AppointmentItem key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No appointments for this day.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Input 
                id="date" 
                type="date"
                defaultValue={date?.toISOString().split('T')[0]}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="client" className="text-sm font-medium">
                Client
              </label>
              <Select>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client} value={client}>{client}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="service" className="text-sm font-medium">
                Service
              </label>
              <Select>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {mockServices.map((service) => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="time" className="text-sm font-medium">
                Time
              </label>
              <Select>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {mockTimeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="duration" className="text-sm font-medium">
                Duration
              </label>
              <Select defaultValue="30">
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAppointment}>
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;

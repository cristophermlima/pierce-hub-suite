
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, Calendar, Package, ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, percentage }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  percentage?: string;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
            
            {percentage && (
              <div className="flex items-center mt-1">
                {trend === 'up' && (
                  <ArrowUp className="text-green-500 mr-1" size={16} />
                )}
                {trend === 'down' && (
                  <ArrowDown className="text-red-500 mr-1" size={16} />
                )}
                <span className={`text-xs ${
                  trend === 'up' ? 'text-green-500' : 
                  trend === 'down' ? 'text-red-500' : ''
                }`}>
                  {percentage} from last month
                </span>
              </div>
            )}
          </div>
          <div className="p-2 bg-accent rounded-md">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AppointmentItem = ({ client, service, time, status }: {
  client: string;
  service: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}) => {
  const statusClass = 
    status === 'completed' ? 'bg-green-500/20 text-green-600' :
    status === 'cancelled' ? 'bg-red-500/20 text-red-600' :
    'bg-yellow-500/20 text-yellow-600';

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="font-medium">{client}</p>
        <p className="text-sm text-muted-foreground">{service}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">{time}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Clients"
          value="1,284"
          icon={<Users size={20} className="text-primary" />}
          trend="up"
          percentage="12%"
        />
        <StatCard 
          title="Appointments"
          value="42"
          icon={<Calendar size={20} className="text-primary" />}
          trend="up"
          percentage="8%"
        />
        <StatCard 
          title="Inventory Items"
          value="215"
          icon={<Package size={20} className="text-primary" />}
          trend="down"
          percentage="3%"
        />
        <StatCard 
          title="Monthly Revenue"
          value="$8,492"
          icon={<BarChart size={20} className="text-primary" />}
          trend="up"
          percentage="24%"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <AppointmentItem 
                client="Gabriel Santos"
                service="Industrial Piercing"
                time="10:00 AM"
                status="scheduled"
              />
              <AppointmentItem 
                client="Maria Oliveira"
                service="Septum Piercing"
                time="11:30 AM"
                status="completed"
              />
              <AppointmentItem 
                client="Lucas Silva"
                service="Helix Piercing"
                time="1:15 PM"
                status="scheduled"
              />
              <AppointmentItem 
                client="Ana Costa"
                service="Tragus Piercing"
                time="3:30 PM"
                status="cancelled"
              />
              <AppointmentItem 
                client="João Melo"
                service="Eyebrow Piercing"
                time="4:45 PM"
                status="scheduled"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="font-medium text-red-500">Low Stock Alert</p>
                <p className="text-sm mt-1">Titanium Barbells - Only 5 items left</p>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="font-medium text-red-500">Low Stock Alert</p>
                <p className="text-sm mt-1">Steel Curved Barbells - Only 3 items left</p>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <p className="font-medium text-yellow-500">Reorder Reminder</p>
                <p className="text-sm mt-1">Sterilization Pouches - 10 packs remaining</p>
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                <p className="font-medium text-green-500">Order Received</p>
                <p className="text-sm mt-1">Surgical Steel Labrets - 50 units added</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

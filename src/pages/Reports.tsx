
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Download } from 'lucide-react';

// Mock data for the charts
const revenueData = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 4800 },
  { month: 'Mar', revenue: 5400 },
  { month: 'Apr', revenue: 6000 },
  { month: 'May', revenue: 5700 },
  { month: 'Jun', revenue: 6400 },
  { month: 'Jul', revenue: 7200 },
  { month: 'Aug', revenue: 8500 },
  { month: 'Sep', revenue: 8200 },
  { month: 'Oct', revenue: 7800 },
  { month: 'Nov', revenue: 7400 },
  { month: 'Dec', revenue: 8500 },
];

const serviceData = [
  { name: 'Ear Lobe', value: 125 },
  { name: 'Helix', value: 90 },
  { name: 'Tragus', value: 75 },
  { name: 'Septum', value: 110 },
  { name: 'Nostril', value: 130 },
  { name: 'Other', value: 85 },
];

const appointmentData = [
  { month: 'Jan', scheduled: 48, completed: 42, cancelled: 6 },
  { month: 'Feb', scheduled: 52, completed: 45, cancelled: 7 },
  { month: 'Mar', scheduled: 60, completed: 55, cancelled: 5 },
  { month: 'Apr', scheduled: 65, completed: 58, cancelled: 7 },
  { month: 'May', scheduled: 68, completed: 60, cancelled: 8 },
  { month: 'Jun', scheduled: 70, completed: 65, cancelled: 5 },
  { month: 'Jul', scheduled: 78, completed: 70, cancelled: 8 },
  { month: 'Aug', scheduled: 85, completed: 78, cancelled: 7 },
  { month: 'Sep', scheduled: 80, completed: 72, cancelled: 8 },
  { month: 'Oct', scheduled: 75, completed: 70, cancelled: 5 },
  { month: 'Nov', scheduled: 70, completed: 65, cancelled: 5 },
  { month: 'Dec', scheduled: 82, completed: 75, cancelled: 7 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9C27B0', '#673AB7'];

const Reports = () => {
  const [timeframe, setTimeframe] = useState('year');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">Analytics & Reports</h1>
        <div className="flex gap-4">
          <Select 
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$74,400</div>
            <p className="text-xs text-muted-foreground">
              +18% from previous year
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0088FE" 
                    fillOpacity={1}
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">833</div>
            <p className="text-xs text-muted-foreground">
              +12% from previous year
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={appointmentData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#00C49F" 
                    fillOpacity={1}
                    fill="url(#colorCompleted)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">354</div>
            <p className="text-xs text-muted-foreground">
              +24% from previous year
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { month: 'Q1', clients: 76 },
                    { month: 'Q2', clients: 92 },
                    { month: 'Q3', clients: 105 },
                    { month: 'Q4', clients: 81 },
                  ]}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <Bar dataKey="clients" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>
                Overview of your business revenue over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <defs>
                    <linearGradient id="colorRevenueMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0088FE" 
                    fillOpacity={1}
                    fill="url(#colorRevenueMain)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Total Annual Revenue</p>
                <p className="text-2xl font-bold">$74,400</p>
              </div>
              <div>
                <p className="text-sm font-medium">Average Monthly</p>
                <p className="text-xl font-bold">$6,200</p>
              </div>
              <div>
                <p className="text-sm font-medium">Year Growth</p>
                <p className="text-xl font-bold text-green-500">+18%</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="appointments" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Statistics</CardTitle>
              <CardDescription>
                Track your appointment trends and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={appointmentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" stackId="a" fill="#00C49F" />
                  <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Total Appointments</p>
                <p className="text-2xl font-bold">833</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completion Rate</p>
                <p className="text-xl font-bold">91%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Cancellation Rate</p>
                <p className="text-xl font-bold text-amber-500">9%</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="services" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
              <CardDescription>
                Distribution of piercing services performed
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-center h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-around">
              <div>
                <p className="text-sm font-medium">Most Popular</p>
                <p className="text-xl font-bold">Nostril (130)</p>
              </div>
              <div>
                <p className="text-sm font-medium">Least Popular</p>
                <p className="text-xl font-bold">Tragus (75)</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Services</p>
                <p className="text-xl font-bold">615</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;

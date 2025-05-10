
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your PiercerHub settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="(11) 98765-4321" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value="********" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="role">Role/Title</Label>
                <Input id="role" defaultValue="Lead Piercer" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="business" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
              <CardDescription>
                Manage your studio information and business details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="businessName">Studio Name</Label>
                <Input id="businessName" defaultValue="Steel & Ink Piercing Studio" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="businessAddress">Address</Label>
                <Input id="businessAddress" defaultValue="123 Main Street" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="businessCity">City</Label>
                  <Input id="businessCity" defaultValue="São Paulo" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="businessState">State</Label>
                  <Input id="businessState" defaultValue="SP" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="businessZip">ZIP/Postal Code</Label>
                  <Input id="businessZip" defaultValue="01000-000" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="businessDescription">Description</Label>
                <Textarea 
                  id="businessDescription" 
                  className="min-h-[100px]"
                  defaultValue="Professional body piercing studio specializing in high-quality piercings and jewelry. Established in 2015."
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="businessHours">Business Hours</Label>
                  <Input id="businessHours" defaultValue="Mon-Sat: 10AM-8PM, Sun: Closed" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="businessWebsite">Website</Label>
                  <Input id="businessWebsite" defaultValue="https://piercingstudio.example.com" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-appointments" className="flex-1">Appointment Confirmations</Label>
                    <Switch id="email-appointments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reminders" className="flex-1">Appointment Reminders</Label>
                    <Switch id="email-reminders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-inventory" className="flex-1">Inventory Alerts</Label>
                    <Switch id="email-inventory" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reports" className="flex-1">Weekly Reports</Label>
                    <Switch id="email-reports" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-marketing" className="flex-1">Marketing Updates</Label>
                    <Switch id="email-marketing" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">In-App Notifications</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-appointments" className="flex-1">New Appointments</Label>
                    <Switch id="app-appointments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-cancellations" className="flex-1">Appointment Cancellations</Label>
                    <Switch id="app-cancellations" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-inventory" className="flex-1">Low Inventory Alerts</Label>
                    <Switch id="app-inventory" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-client" className="flex-1">Client Messages</Label>
                    <Switch id="app-client" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your PiercerHub.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4 cursor-pointer bg-card border-primary">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Dark (Default)</span>
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                    </div>
                    <div className="h-20 bg-background rounded-md border border-border">
                      <div className="h-6 w-full bg-card border-b border-border"></div>
                    </div>
                  </div>
                  <div className="border rounded-md p-4 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Light</span>
                      <div className="w-4 h-4 rounded-full border border-muted-foreground"></div>
                    </div>
                    <div className="h-20 bg-white rounded-md border">
                      <div className="h-6 w-full bg-gray-100 border-b"></div>
                    </div>
                  </div>
                  <div className="border rounded-md p-4 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">System</span>
                      <div className="w-4 h-4 rounded-full border border-muted-foreground"></div>
                    </div>
                    <div className="h-20 bg-gradient-to-r from-background to-black rounded-md border border-border">
                      <div className="h-6 w-full bg-gradient-to-r from-card to-gray-800 border-b border-border"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Dashboard Layout</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 cursor-pointer bg-card border-primary">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Standard</span>
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                    </div>
                    <div className="h-20 bg-accent rounded-md p-1 grid grid-cols-4 gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-card rounded-sm"></div>
                      ))}
                      <div className="col-span-2 bg-card rounded-sm"></div>
                      <div className="col-span-2 bg-card rounded-sm"></div>
                    </div>
                  </div>
                  <div className="border rounded-md p-4 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Compact</span>
                      <div className="w-4 h-4 rounded-full border border-muted-foreground"></div>
                    </div>
                    <div className="h-20 bg-accent rounded-md p-1 grid grid-cols-2 gap-1">
                      <div className="bg-card rounded-sm"></div>
                      <div className="bg-card rounded-sm"></div>
                      <div className="col-span-2 bg-card rounded-sm h-10"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Additional Options</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compact-menu" className="flex-1">Compact Menu</Label>
                    <Switch id="compact-menu" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-animations" className="flex-1">UI Animations</Label>
                    <Switch id="show-animations" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dense-tables" className="flex-1">Dense Tables</Label>
                    <Switch id="dense-tables" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

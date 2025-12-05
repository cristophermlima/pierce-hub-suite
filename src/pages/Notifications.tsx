
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Package, InfoIcon, Settings, CheckCircle } from "lucide-react";
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useTranslation } from '@/hooks/useTranslation';

const Notifications = () => {
  const { t } = useTranslation();
  const {
    notifications,
    appointmentNotifs,
    inventoryNotifs,
    systemNotifs,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const NotificationItem = ({ notification }: { notification: any }) => {
    const icons = {
      'appointment': <Calendar className="h-5 w-5 text-blue-500" />,
      'inventory': <Package className="h-5 w-5 text-orange-500" />,
      'system': <InfoIcon className="h-5 w-5 text-green-500" />
    };
    
    return (
      <div className={`p-4 border-b border-border flex gap-4 ${notification.read ? '' : 'bg-secondary/30'}`}>
        <div className="mt-1">
          {icons[notification.type]}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{notification.title}</h4>
            {!notification.read && <Badge variant="outline" className="text-xs">{t('new')}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          {notification.client && (
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="" alt={notification.client} />
                <AvatarFallback className="text-xs">{notification.avatar}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{notification.client}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{notification.time}</span>
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => markAsRead(notification.id)}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {t('markAsRead')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('notificationsTitle')}</h2>
          <p className="text-muted-foreground">
            {t('notificationsDescription')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            {t('markAllAsRead')}
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span>{t('notificationCenter')}</span>
              {unreadCount > 0 && (
                <Badge className="ml-2">{unreadCount}</Badge>
              )}
            </CardTitle>
          </div>
          <CardDescription>
            {t('studioUpdates')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="border-b border-border">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                >
                  {t('all')} ({notifications.length})
                </TabsTrigger>
                <TabsTrigger
                  value="appointments"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                >
                  {t('appointments')} ({appointmentNotifs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="inventory"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                >
                  {t('stock')} ({inventoryNotifs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="system"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                >
                  {t('system')} ({systemNotifs.length})
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              <TabsContent value="all" className="mt-0">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">{t('noNotifications')}</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                )}
              </TabsContent>
              <TabsContent value="appointments" className="mt-0">
                {appointmentNotifs.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">{t('noAppointmentNotifications')}</p>
                  </div>
                ) : (
                  appointmentNotifs.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                )}
              </TabsContent>
              <TabsContent value="inventory" className="mt-0">
                {inventoryNotifs.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">{t('noInventoryNotifications')}</p>
                  </div>
                ) : (
                  inventoryNotifs.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                )}
              </TabsContent>
              <TabsContent value="system" className="mt-0">
                {systemNotifs.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">{t('noSystemNotifications')}</p>
                  </div>
                ) : (
                  systemNotifs.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-border p-4">
          <Button variant="outline" className="w-full">
            {t('viewAllNotifications')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Notifications;

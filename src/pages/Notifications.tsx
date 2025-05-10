
import React, { useState } from 'react';
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

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Lembrete de Agendamento',
      message: 'Ana Silva tem agendamento para Piercing Labret hoje às 14:00',
      time: '1 hora atrás',
      read: false,
      client: 'Ana Silva',
      avatar: 'AS'
    },
    {
      id: 2,
      type: 'inventory',
      title: 'Alerta de Estoque',
      message: 'Barbell 16G está com estoque abaixo do mínimo (apenas 2 unidades)',
      time: '3 horas atrás',
      read: false
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Novo Agendamento',
      message: 'Carlos Oliveira agendou um Piercing Septum para amanhã às 11:30',
      time: '5 horas atrás',
      read: true,
      client: 'Carlos Oliveira',
      avatar: 'CO'
    },
    {
      id: 4,
      type: 'inventory',
      title: 'Pedido Recebido',
      message: 'Pedido #1234 de Piercing Brasil foi recebido e registrado',
      time: '1 dia atrás',
      read: true
    },
    {
      id: 5,
      type: 'system',
      title: 'Atualização do Sistema',
      message: 'PiercerHub foi atualizado para a versão 2.1.0',
      time: '2 dias atrás',
      read: true
    },
    {
      id: 6,
      type: 'system',
      title: 'Backup Automático',
      message: 'Backup dos dados realizado com sucesso',
      time: '3 dias atrás',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  const appointmentNotifs = notifications.filter(notif => notif.type === 'appointment');
  const inventoryNotifs = notifications.filter(notif => notif.type === 'inventory');
  const systemNotifs = notifications.filter(notif => notif.type === 'system');

  const markAsRead = (id) => {
    setNotifications(
      notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notif => ({ ...notif, read: true }))
    );
  };

  const NotificationItem = ({ notification }) => {
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
            {!notification.read && <Badge variant="outline" className="text-xs">Novo</Badge>}
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
                Marcar como lida
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
          <h2 className="text-2xl font-bold">Notificações</h2>
          <p className="text-muted-foreground">
            Gerencie suas notificações, lembretes e alertas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar tudo como lido
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
              <span>Central de Notificações</span>
              {unreadCount > 0 && (
                <Badge className="ml-2">{unreadCount}</Badge>
              )}
            </CardTitle>
          </div>
          <CardDescription>
            Todas as atualizações e alertas do seu estúdio
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
                  Todas ({notifications.length})
                </TabsTrigger>
                <TabsTrigger
                  value="appointments"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                >
                  Agendamentos ({appointmentNotifs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="inventory"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                >
                  Estoque ({inventoryNotifs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="system"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                >
                  Sistema ({systemNotifs.length})
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              <TabsContent value="all" className="mt-0">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">Nenhuma notificação</p>
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
                    <p className="text-muted-foreground">Nenhuma notificação de agendamento</p>
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
                    <p className="text-muted-foreground">Nenhuma notificação de estoque</p>
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
                    <p className="text-muted-foreground">Nenhuma notificação de sistema</p>
                  </div>
                ) : (
                  systemNotifs.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                )}
              </TabsContent>
            </div>
          </TabsContent>
        </CardContent>
        <CardFooter className="border-t border-border p-4">
          <Button variant="outline" className="w-full">
            Ver todas as notificações
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Notifications;

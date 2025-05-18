
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

export const NotificationSettings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de notificação foram salvas com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>
          Escolha quais notificações você deseja receber.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="pr-4 space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Notificações por E-mail</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-appointments" className="flex-1">Confirmações de Agendamento</Label>
                  <Switch id="email-appointments" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-reminders" className="flex-1">Lembretes de Agendamento</Label>
                  <Switch id="email-reminders" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-inventory" className="flex-1">Alertas de Estoque</Label>
                  <Switch id="email-inventory" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-reports" className="flex-1">Relatórios Semanais</Label>
                  <Switch id="email-reports" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-marketing" className="flex-1">Atualizações de Marketing</Label>
                  <Switch id="email-marketing" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Notificações no Aplicativo</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-appointments" className="flex-1">Novos Agendamentos</Label>
                  <Switch id="app-appointments" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-cancellations" className="flex-1">Cancelamentos de Agendamento</Label>
                  <Switch id="app-cancellations" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-inventory" className="flex-1">Alertas de Estoque Baixo</Label>
                  <Switch id="app-inventory" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-client" className="flex-1">Mensagens de Clientes</Label>
                  <Switch id="app-client" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>Salvar Preferências</Button>
      </CardFooter>
    </Card>
  );
};

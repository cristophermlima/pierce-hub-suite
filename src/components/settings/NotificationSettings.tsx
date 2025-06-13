
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationSettings } from '@/features/settings/hooks/useNotificationSettings';

export const NotificationSettings = () => {
  const { settings, isLoading, updateSetting, saveSettings, isUpdating } = useNotificationSettings();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

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
                  <Switch 
                    id="email-appointments" 
                    checked={settings.email_appointments}
                    onCheckedChange={(checked) => updateSetting('email_appointments', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-reminders" className="flex-1">Lembretes de Agendamento</Label>
                  <Switch 
                    id="email-reminders" 
                    checked={settings.email_reminders}
                    onCheckedChange={(checked) => updateSetting('email_reminders', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-inventory" className="flex-1">Alertas de Estoque</Label>
                  <Switch 
                    id="email-inventory" 
                    checked={settings.email_inventory}
                    onCheckedChange={(checked) => updateSetting('email_inventory', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-reports" className="flex-1">Relatórios Semanais</Label>
                  <Switch 
                    id="email-reports" 
                    checked={settings.email_reports}
                    onCheckedChange={(checked) => updateSetting('email_reports', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-marketing" className="flex-1">Atualizações de Marketing</Label>
                  <Switch 
                    id="email-marketing" 
                    checked={settings.email_marketing}
                    onCheckedChange={(checked) => updateSetting('email_marketing', checked)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Notificações no Aplicativo</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-appointments" className="flex-1">Novos Agendamentos</Label>
                  <Switch 
                    id="app-appointments" 
                    checked={settings.app_appointments}
                    onCheckedChange={(checked) => updateSetting('app_appointments', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-cancellations" className="flex-1">Cancelamentos de Agendamento</Label>
                  <Switch 
                    id="app-cancellations" 
                    checked={settings.app_cancellations}
                    onCheckedChange={(checked) => updateSetting('app_cancellations', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-inventory" className="flex-1">Alertas de Estoque Baixo</Label>
                  <Switch 
                    id="app-inventory" 
                    checked={settings.app_inventory}
                    onCheckedChange={(checked) => updateSetting('app_inventory', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-client" className="flex-1">Mensagens de Clientes</Label>
                  <Switch 
                    id="app-client" 
                    checked={settings.app_client}
                    onCheckedChange={(checked) => updateSetting('app_client', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={saveSettings} disabled={isUpdating}>
          {isUpdating ? 'Salvando...' : 'Salvar Preferências'}
        </Button>
      </CardFooter>
    </Card>
  );
};

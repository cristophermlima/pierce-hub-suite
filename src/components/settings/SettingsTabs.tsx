
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProfileSettings } from './ProfileSettings';
import { BusinessSettings } from './BusinessSettings';
import { NotificationSettings } from './NotificationSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { CurrencyLanguageSettings } from './CurrencyLanguageSettings';

export const SettingsTabs = () => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <ScrollArea className="max-w-full">
        <TabsList className="flex flex-nowrap overflow-x-auto py-1 w-auto mb-2">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="business">Empresa</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="localization">Regionalização</TabsTrigger>
        </TabsList>
      </ScrollArea>
      
      <TabsContent value="profile" className="pt-4">
        <ProfileSettings />
      </TabsContent>
      
      <TabsContent value="business" className="pt-4">
        <BusinessSettings />
      </TabsContent>
      
      <TabsContent value="notifications" className="pt-4">
        <NotificationSettings />
      </TabsContent>
      
      <TabsContent value="appearance" className="pt-4">
        <AppearanceSettings />
      </TabsContent>
      
      <TabsContent value="localization" className="pt-4">
        <CurrencyLanguageSettings />
      </TabsContent>
    </Tabs>
  );
};

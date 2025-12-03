
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProfileSettings } from './ProfileSettings';
import { BusinessSettings } from './BusinessSettings';
import { NotificationSettings } from './NotificationSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { CurrencyLanguageSettings } from './CurrencyLanguageSettings';
import { useTranslation } from '@/hooks/useTranslation';

export const SettingsTabs = () => {
  const { t } = useTranslation();
  
  return (
    <Tabs defaultValue="profile" className="w-full">
      <ScrollArea className="max-w-full">
        <TabsList className="flex flex-nowrap overflow-x-auto py-1 w-auto mb-2">
          <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          <TabsTrigger value="business">{t('business')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('notificationsTab')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('appearance')}</TabsTrigger>
          <TabsTrigger value="localization">{t('regionalization')}</TabsTrigger>
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

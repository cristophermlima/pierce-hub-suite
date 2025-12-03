
import React from 'react';
import { SettingsTabs } from '@/components/settings/SettingsTabs';
import { useTranslation } from '@/hooks/useTranslation';

const Settings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('settings')}</h1>
        <p className="text-muted-foreground">{t('settingsDescription')}</p>
      </div>

      <SettingsTabs />
    </div>
  );
};

export default Settings;

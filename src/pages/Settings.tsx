
import React from 'react';
import { SettingsTabs } from '@/components/settings/SettingsTabs';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas configurações e preferências do PiercerHub.</p>
      </div>

      <SettingsTabs />
    </div>
  );
};

export default Settings;

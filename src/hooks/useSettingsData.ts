import { useState } from 'react';
import { SettingsData } from '../types';
import { Strings, Arrays } from '../constants/strings';

export const useSettingsData = () => {
  const [settingsData, setSettingsData] = useState<SettingsData>({
    environment: Strings.defaultProd,
    qaUrl: '',
    experience: Strings.defaultWebview,
  });

  const updateSettingsData = (updates: Partial<SettingsData>) => {
    setSettingsData(prev => ({ ...prev, ...updates }));
  };

  return {
    settingsData,
    updateSettingsData,
  };
};

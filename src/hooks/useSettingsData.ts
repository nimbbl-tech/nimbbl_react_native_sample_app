import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsData } from '../types';
import { Strings, Arrays } from '../constants/strings';

export const useSettingsData = () => {
  const [settingsData, setSettingsData] = useState<SettingsData>({
    environment: 'Prod', // Default to Prod
    qaUrl: 'https://qa1api.nimbbl.tech/', // Default QA URL for when QA is selected
    experience: Strings.defaultWebview,
  });

  // Load settings from AsyncStorage on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedEnvironment = await AsyncStorage.getItem('selectedEnvironment');
      const savedQaUrl = await AsyncStorage.getItem('qaEnvironmentUrl');
      const savedExperience = await AsyncStorage.getItem('selectedExperience');

      setSettingsData(prev => ({
        ...prev,
        environment: savedEnvironment || 'Prod', // Always default to Prod if no saved value
        qaUrl: savedQaUrl || 'https://qa1api.nimbbl.tech/', // Default QA URL
        experience: savedExperience || Strings.defaultWebview, // Default experience
      }));
    } catch (error) {
      // Error loading settings
    }
  };

  const updateSettingsData = async (updates: Partial<SettingsData>) => {
    try {
      // Update local state
      setSettingsData(prev => ({ ...prev, ...updates }));

      // Persist to AsyncStorage (matching iOS UserDefaults pattern)
      if (updates.environment !== undefined) {
        await AsyncStorage.setItem('selectedEnvironment', updates.environment);
      }
      if (updates.qaUrl !== undefined) {
        await AsyncStorage.setItem('qaEnvironmentUrl', updates.qaUrl);
      }
      if (updates.experience !== undefined) {
        await AsyncStorage.setItem('selectedExperience', updates.experience);
      }
    } catch (error) {
      // Error saving settings
    }
  };

  return {
    settingsData,
    updateSettingsData,
  };
};

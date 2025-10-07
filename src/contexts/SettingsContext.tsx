import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsData } from '../types';
import { Strings } from '../constants/strings';
import { API_URLS } from '../constants/apiUrls';

interface SettingsContextType {
  settingsData: SettingsData;
  updateSettingsData: (updates: Partial<SettingsData>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settingsData, setSettingsData] = useState<SettingsData>({
    environment: 'Prod', // Default to Prod
    qaUrl: API_URLS.QA, // Default QA URL for when QA is selected
    preProdUrl: API_URLS.PRE_PROD, // Default Pre-Prod URL
    prodUrl: API_URLS.PROD, // Default Prod URL
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
      const savedPreProdUrl = await AsyncStorage.getItem('preProdEnvironmentUrl');
      const savedProdUrl = await AsyncStorage.getItem('prodEnvironmentUrl');
      const savedExperience = await AsyncStorage.getItem('selectedExperience');

      const newSettings = {
        environment: savedEnvironment || 'Prod',
        qaUrl: savedQaUrl || API_URLS.QA,
        preProdUrl: savedPreProdUrl || API_URLS.PRE_PROD,
        prodUrl: savedProdUrl || API_URLS.PROD,
        experience: savedExperience || Strings.defaultWebview,
      };

      setSettingsData(newSettings);
    } catch (error) {
      console.error('🔧 SettingsContext: Error loading settings:', error);
    }
  };

  const updateSettingsData = async (updates: Partial<SettingsData>) => {
    try {
      // Update local state
      setSettingsData(prev => ({ ...prev, ...updates }));

      // Persist to AsyncStorage
      if (updates.environment !== undefined) {
        await AsyncStorage.setItem('selectedEnvironment', updates.environment);
      }
      if (updates.qaUrl !== undefined) {
        await AsyncStorage.setItem('qaEnvironmentUrl', updates.qaUrl);
      }
      if (updates.preProdUrl !== undefined) {
        await AsyncStorage.setItem('preProdEnvironmentUrl', updates.preProdUrl);
      }
      if (updates.prodUrl !== undefined) {
        await AsyncStorage.setItem('prodEnvironmentUrl', updates.prodUrl);
      }
      if (updates.experience !== undefined) {
        await AsyncStorage.setItem('selectedExperience', updates.experience);
      }
    } catch (error) {
      console.error('🔧 SettingsContext: Error saving settings:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settingsData, updateSettingsData }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

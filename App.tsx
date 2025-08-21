/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MainScreen } from './src/screens/MainScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SuccessScreen } from './src/screens/SuccessScreen';
import { useOrderData } from './src/hooks/useOrderData';
import { useSettingsData } from './src/hooks/useSettingsData';
import { Screen } from './src/types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const { orderData, updateOrderData } = useOrderData();
  const { settingsData, updateSettingsData } = useSettingsData();

  const handleSettingsPress = () => {
    setCurrentScreen('settings');
  };

  const handlePayPress = () => {
    setCurrentScreen('success');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'settings':
        return (
          <SettingsScreen
            settingsData={settingsData}
            onSettingsDataChange={updateSettingsData}
            onBackPress={handleBackToMain}
          />
        );
      case 'success':
        return (
          <SuccessScreen
            onBackPress={handleBackToMain}
          />
        );
      case 'main':
      default:
        return (
          <MainScreen
            orderData={orderData}
            onOrderDataChange={updateOrderData}
            onSettingsPress={handleSettingsPress}
            onPayPress={handlePayPress}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {renderScreen()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

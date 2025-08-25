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
import PaymentResultScreen from './src/screens/PaymentResultScreen';
import { useOrderData } from './src/hooks/useOrderData';
import { useSettingsData } from './src/hooks/useSettingsData';
import { Screen } from './src/types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [paymentResult, setPaymentResult] = useState<{
    isSuccess: boolean;
    orderId: string;
    transactionId: string;
    errorMessage: string;
  }>({
    isSuccess: false,
    orderId: '',
    transactionId: '',
    errorMessage: '',
  });
  
  const { orderData, updateOrderData } = useOrderData();
  const { settingsData, updateSettingsData } = useSettingsData();

  const handleSettingsPress = () => {
    setCurrentScreen('settings');
  };

  const handlePayPress = () => {
    // This will be handled by the payment service callbacks
  };

  const handlePaymentSuccess = (orderId: string, transactionId: string) => {
    setPaymentResult({
      isSuccess: true,
      orderId,
      transactionId,
      errorMessage: '',
    });
    setCurrentScreen('result');
  };

  const handlePaymentFailed = (orderId: string, errorMessage: string) => {
    setPaymentResult({
      isSuccess: false,
      orderId,
      transactionId: '',
      errorMessage,
    });
    setCurrentScreen('result');
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
      case 'result':
        return (
          <PaymentResultScreen
            isSuccess={paymentResult.isSuccess}
            orderId={paymentResult.orderId}
            transactionId={paymentResult.transactionId}
            errorMessage={paymentResult.errorMessage}
            onDone={handleBackToMain}
            onTryAgain={handlePayPress}
            onBackPress={handleBackToMain}
          />
        );
      case 'main':
      default:
        return (
          <MainScreen
            orderData={orderData}
            settingsData={settingsData}
            onOrderDataChange={updateOrderData}
            onSettingsPress={handleSettingsPress}
            onPayPress={handlePayPress}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailed={handlePaymentFailed}
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

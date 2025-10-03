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
    orderId: string;
    transactionId?: string;
    status: 'success' | 'failed' | 'cancelled';
    message?: string;
    amount?: number;
    currency?: string;
    invoiceId?: string;
    orderDate?: string;
    reason?: string;
    cancellationReason?: string;
    attempts?: number;
    referrerPlatform?: string;
    referrerPlatformVersion?: string;
    deviceName?: string;
    deviceOsName?: string;
    deviceIpAddress?: string;
    shippingCity?: string;
    shippingState?: string;
    shippingCountry?: string;
    shippingPincode?: string;
    isEncrypted?: boolean;
    encryptedResponse?: string;
  }>({
    orderId: '',
    status: 'failed',
  });
  
  const { orderData, updateOrderData } = useOrderData();
  const { settingsData, updateSettingsData } = useSettingsData();

  const handleSettingsPress = () => {
    setCurrentScreen('settings');
  };

  const handlePayPress = () => {
    // This will be handled by the payment service callbacks
  };

  const handleCheckoutResponse = (data: any) => {
    // Parse the nested data if it's a string
    let parsedData = data;
    if (typeof data?.data === 'string') {
      try {
        // The data field contains a stringified object, parse it directly as JSON
        parsedData = JSON.parse(data.data);
      } catch (e) {
        // Fallback: extract all available data using regex
        const extractValue = (key: string) => {
          const match = data.data.match(new RegExp(`${key}=([^,}]+)`));
          return match ? match[1].trim() : undefined;
        };

        // Extract order details from the nested JSON string
        let orderDetails = null;
        const orderMatch = data.data.match(/order=(\{[^}]+\})/);
        if (orderMatch) {
          try {
            orderDetails = JSON.parse(orderMatch[1]);
          } catch (e) {
            // Failed to parse order details
          }
        }

        parsedData = {
          transaction_id: extractValue('transaction_id'),
          nimbbl_transaction_id: extractValue('nimbbl_transaction_id'),
          order_id: extractValue('order_id') || extractValue('nimbbl_order_id'),
          status: extractValue('status'),
          message: extractValue('message'),
          reason: extractValue('reason'),
          is_callback: extractValue('is_callback'),
          order: orderDetails
        };
      }
    }
    
    // Check for encrypted response (like Android sample app)
    const isEncrypted = parsedData?.encrypted_response && parsedData.encrypted_response !== '';
    
    if (isEncrypted) {
      // Handle encrypted response like Android sample app
      setPaymentResult({
        orderId: 'N/A',
        status: 'failed',
        message: 'Encrypted response received. Please handle decryption on your server.',
        isEncrypted: true,
        encryptedResponse: parsedData.encrypted_response,
      });
      setCurrentScreen('result');
      return;
    }
    
    // Extract order information from the parsed data
    const orderId = parsedData?.order_id || parsedData?.nimbbl_order_id || data?.order_id || 'N/A';
    const status = parsedData?.status?.toLowerCase() || data?.status?.toLowerCase();
    
    // Extract order details if available
    let orderDetails = null;
    if (parsedData?.order && typeof parsedData.order === 'string') {
      try {
        // The order field contains valid JSON, parse it directly
        orderDetails = JSON.parse(parsedData.order);
      } catch (e) {
        // Failed to parse order details
      }
    } else if (parsedData?.order && typeof parsedData.order === 'object') {
      orderDetails = parsedData.order;
    }
    
    setPaymentResult({
      orderId,
      transactionId: parsedData?.transaction_id || parsedData?.nimbbl_transaction_id || data?.transaction_id,
      status: status === 'success' || status === 'completed' ? 'success' : 'failed',
      message: parsedData?.message || data?.message || (status === 'success' || status === 'completed' ? 'Your payment has been processed successfully' : 'Payment failed'),
      amount: orderDetails?.total_amount || orderDetails?.grand_total || parsedData?.amount || data?.amount,
      currency: orderDetails?.currency || parsedData?.currency || data?.currency || 'INR',
      invoiceId: orderDetails?.invoice_id || parsedData?.invoice_id || data?.invoice_id,
      orderDate: orderDetails?.order_date || parsedData?.order_date || data?.order_date,
      reason: parsedData?.reason || data?.reason,
      cancellationReason: orderDetails?.cancellation_reason || parsedData?.cancellation_reason || data?.cancellation_reason,
      attempts: orderDetails?.attempts || parsedData?.attempts || data?.attempts,
      referrerPlatform: orderDetails?.referrer_platform || parsedData?.referrer_platform || data?.referrer_platform,
      referrerPlatformVersion: orderDetails?.referrer_platform_version || parsedData?.referrer_platform_version || data?.referrer_platform_version,
      deviceName: orderDetails?.device?.device_name || parsedData?.device_name || data?.device_name,
      deviceOsName: orderDetails?.device?.os_name || parsedData?.device_os_name || data?.device_os_name,
      deviceIpAddress: orderDetails?.device?.ip_address || parsedData?.device_ip_address || data?.device_ip_address,
      shippingCity: orderDetails?.shipping_address?.city || parsedData?.shipping_city || data?.shipping_city,
      shippingState: orderDetails?.shipping_address?.state || parsedData?.shipping_state || data?.shipping_state,
      shippingCountry: orderDetails?.shipping_address?.country || parsedData?.shipping_country || data?.shipping_country,
      shippingPincode: orderDetails?.shipping_address?.pincode || parsedData?.shipping_pincode || data?.shipping_pincode,
      isEncrypted: false,
      encryptedResponse: undefined,
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
            paymentData={paymentResult}
            onBackToHome={handleBackToMain}
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
            onCheckoutResponse={handleCheckoutResponse}
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

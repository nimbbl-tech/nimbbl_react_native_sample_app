import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { OrderData, SettingsData } from '../types';
import { paymentService } from '../services/PaymentService';

export const usePayment = (
  onPayPress: () => void, 
  onCheckoutResponse?: (data: any) => void
) => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const handlePayment = useCallback(async (orderData: OrderData, settingsData?: SettingsData) => {
    
    if (isPaymentLoading) return;
    
    setIsPaymentLoading(true);
    
    try {
      // Set up unified checkout response callback
      paymentService.setCheckoutResponseCallback((data) => {
        if (onCheckoutResponse) {
          onCheckoutResponse(data);
        } else {
          // Fallback behavior if no callback is provided
          const status = data?.status?.toLowerCase();
          if (status === 'success' || status === 'completed') {
            Alert.alert('Payment Successful', 'Your payment has been processed successfully.');
          } else {
            Alert.alert('Payment Failed', 'Please try again.');
          }
        }
      });
      
      // Process payment
      const result = await paymentService.processPayment(orderData, settingsData);
      
      if (result.success) {
        // Payment webview opened successfully
      } else {
        Alert.alert('Payment Error', result.errorMessage || 'An error occurred during payment.');
      }
    } catch (error) {
      // Payment error occurred
      Alert.alert('Payment Error', 'An unexpected error occurred during payment.');
    } finally {
      setIsPaymentLoading(false);
    }
  }, [isPaymentLoading, onPayPress, onCheckoutResponse]);

  return {
    isPaymentLoading,
    handlePayment,
  };
};

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { OrderData, SettingsData } from '../types';
import { paymentService } from '../services/PaymentService';

export const usePayment = (
  onPayPress: () => void, 
  onPaymentSuccess?: (orderId: string, transactionId: string) => void,
  onPaymentFailed?: (orderId: string, errorMessage: string) => void
) => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const handlePayment = useCallback(async (orderData: OrderData, settingsData?: SettingsData) => {
    if (isPaymentLoading) return;
    
    setIsPaymentLoading(true);
    
    try {
      // Set up success/failure callbacks with order details
      paymentService.setPaymentSuccessCallback((orderId, transactionId) => {
        if (onPaymentSuccess) {
          onPaymentSuccess(orderId || 'N/A', transactionId || 'N/A');
        } else {
          onPayPress();
        }
      });
      
      paymentService.setPaymentFailureCallback((orderId, errorMessage) => {
        if (onPaymentFailed) {
          onPaymentFailed(orderId || 'N/A', errorMessage || 'Payment failed. Please try again.');
        } else {
          Alert.alert('Payment Failed', 'Please try again.');
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
      console.error('Payment error:', error);
      Alert.alert('Payment Error', 'An unexpected error occurred during payment.');
    } finally {
      setIsPaymentLoading(false);
    }
  }, [isPaymentLoading, onPayPress, onPaymentFailed]);

  const cleanup = useCallback(() => {
    paymentService.cleanup();
  }, []);

  return {
    isPaymentLoading,
    handlePayment,
    cleanup,
  };
};

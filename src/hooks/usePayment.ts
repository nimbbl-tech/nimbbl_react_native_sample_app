import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { OrderData } from '../types';
import { paymentService } from '../services/PaymentService';

export const usePayment = (onPayPress: () => void) => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const handlePayment = useCallback(async (orderData: OrderData) => {
    if (isPaymentLoading) return;
    
    setIsPaymentLoading(true);
    
    try {
      const result = await paymentService.processPayment(orderData);
      
      if (result.success) {
        Alert.alert('Payment Success', 'Payment completed successfully!', [
          { text: 'OK', onPress: onPayPress }
        ]);
      } else {
        Alert.alert('Payment Error', result.errorMessage || 'An error occurred during payment.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Error', 'An unexpected error occurred during payment.');
    } finally {
      setIsPaymentLoading(false);
    }
  }, [isPaymentLoading, onPayPress]);

  const cleanup = useCallback(() => {
    paymentService.cleanup();
  }, []);

  return {
    isPaymentLoading,
    handlePayment,
    cleanup,
  };
};

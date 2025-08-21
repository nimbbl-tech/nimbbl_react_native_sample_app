import { useState, useCallback } from 'react';
import { Arrays, DropdownRelationships } from '../constants/strings';
import { PaymentDropdownData } from '../types';

export const useDropdownRelationships = () => {
  const [paymentData, setPaymentData] = useState<PaymentDropdownData>({
    paymentType: Arrays.paymentType[0], // 'all payments modes'
    subPaymentType: DropdownRelationships.paymentTypeToSubPayment[Arrays.paymentType[0]],
    availableSubPaymentOptions: DropdownRelationships.subPaymentOptions[Arrays.paymentType[0]],
  });

  const updatePaymentType = useCallback((newPaymentType: string) => {
    const defaultSubPayment = DropdownRelationships.paymentTypeToSubPayment[newPaymentType];
    const availableOptions = DropdownRelationships.subPaymentOptions[newPaymentType];
    
    setPaymentData({
      paymentType: newPaymentType,
      subPaymentType: defaultSubPayment,
      availableSubPaymentOptions: availableOptions,
    });
  }, []);

  const updateSubPaymentType = useCallback((newSubPaymentType: string) => {
    setPaymentData(prev => ({
      ...prev,
      subPaymentType: newSubPaymentType,
    }));
  }, []);

  return {
    paymentData,
    updatePaymentType,
    updateSubPaymentType,
  };
};

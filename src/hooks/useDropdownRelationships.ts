import { useState, useCallback, useEffect } from 'react';
import { Arrays, DropdownRelationships } from '../constants/strings';
import { PaymentDropdownData } from '../types';

export const useDropdownRelationships = (initialPaymentType?: string, initialSubPaymentType?: string) => {
  const [paymentData, setPaymentData] = useState<PaymentDropdownData>({
    paymentType: initialPaymentType || Arrays.paymentType[0], // 'all payments modes'
    subPaymentType: initialSubPaymentType || DropdownRelationships.paymentTypeToSubPayment[Arrays.paymentType[0] as keyof typeof DropdownRelationships.paymentTypeToSubPayment],
    availableSubPaymentOptions: [...DropdownRelationships.subPaymentOptions[Arrays.paymentType[0] as keyof typeof DropdownRelationships.subPaymentOptions]],
  });

  // Update dropdown relationships when initial values change
  useEffect(() => {
    if (initialPaymentType && initialPaymentType !== paymentData.paymentType) {
      updatePaymentType(initialPaymentType);
    }
  }, [initialPaymentType]);

  const updatePaymentType = useCallback((newPaymentType: string) => {
    const defaultSubPayment = DropdownRelationships.paymentTypeToSubPayment[newPaymentType as keyof typeof DropdownRelationships.paymentTypeToSubPayment];
    const availableOptions = DropdownRelationships.subPaymentOptions[newPaymentType as keyof typeof DropdownRelationships.subPaymentOptions];
    
    setPaymentData({
      paymentType: newPaymentType,
      subPaymentType: defaultSubPayment,
      availableSubPaymentOptions: [...availableOptions],
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

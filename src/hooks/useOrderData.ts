import { useState } from 'react';
import { OrderData } from '../types';
import { Strings, Arrays } from '../constants/strings';

export const useOrderData = () => {
  const [orderData, setOrderData] = useState<OrderData>({
    amount: '4',
    currency: Arrays.appCurrencyFormat[0], // 'INR'
    orderLineItems: true,
    headerCustomisation: Strings.brandNameAndLogo,
    paymentCustomisation: Strings.allPaymentModes,
    subPaymentCustomisation: Strings.allBanks,
    userDetails: false,
    firstName: '',
    mobileNumber: '',
    email: '',
  });

  const updateOrderData = (updates: Partial<OrderData>) => {
    setOrderData(prev => ({ ...prev, ...updates }));
  };

  return {
    orderData,
    updateOrderData,
  };
};

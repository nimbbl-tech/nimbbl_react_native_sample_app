import { OrderData } from '../types';

export const validateAmount = (amount: string): boolean => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount > 0;
};

export const validateUserDetails = (orderData: OrderData): string | null => {
  if (!orderData.userDetails) return null;
  
  if (!orderData.firstName?.trim()) {
    return 'Please enter your name.';
  }
  
  if (!orderData.mobileNumber?.trim()) {
    return 'Please enter your mobile number.';
  }
  
  if (!orderData.email?.trim()) {
    return 'Please enter your email address.';
  }
  
  return null;
};

export const validateOrderData = (orderData: OrderData): { isValid: boolean; errorMessage?: string } => {
  if (!validateAmount(orderData.amount)) {
    return { isValid: false, errorMessage: 'Please enter a valid amount greater than 0.' };
  }
  
  const userDetailsError = validateUserDetails(orderData);
  if (userDetailsError) {
    return { isValid: false, errorMessage: userDetailsError };
  }
  
  return { isValid: true };
};

export type Screen = 'main' | 'settings' | 'result';

export interface OrderData {
  amount: string;
  currency: string;
  orderLineItems: boolean;
  headerCustomisation: string;
  paymentCustomisation: string;
  subPaymentCustomisation: string;
  userDetails: boolean;
  firstName: string;
  mobileNumber: string;
  email: string;
}

export interface SettingsData {
  environment: string;
  qaUrl: string;
  preProdUrl: string;
  prodUrl: string;
  experience: string;
}

export interface DropdownOption {
  label: string;
  value: string;
  options: string[];
}

export interface PaymentDropdownData {
  paymentType: string;
  subPaymentType: string;
  availableSubPaymentOptions: string[];
}

export interface PaymentResultData {
  orderId: string;
  transactionId?: string;
  status: 'success' | 'failed' | 'cancelled';
  message?: string;
  amount?: number;
  currency?: string;
  // Additional fields from Android sample app
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
}

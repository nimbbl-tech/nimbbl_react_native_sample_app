export type Screen = 'main' | 'settings' | 'success';

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

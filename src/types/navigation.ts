import { SettingsData, PaymentResultData } from './index';

export type RootStackParamList = {
  Main: { settingsData?: SettingsData } | undefined;
  Settings: undefined;
  PaymentResult: { paymentData: PaymentResultData };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

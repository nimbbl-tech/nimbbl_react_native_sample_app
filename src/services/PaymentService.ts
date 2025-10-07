import { OrderData, SettingsData } from '../types';
import { validateOrderData } from '../utils/validation';
import { NimbblSDK } from 'nimbbl-mobile-react-native-sdk';
import { API_URLS } from '../constants/apiUrls';

// Payment mode mappings (matching iOS implementation exactly)
const PAYMENT_MODE_MAPPING: Record<string, string> = {
  'all payments modes': '',
  'netbanking': 'Netbanking',
  'wallet': 'Wallet',
  'card': 'card',
  'upi': 'UPI'
};

// Bank code mappings (matching iOS implementation exactly)
const BANK_CODE_MAPPING: Record<string, string> = {
  'all banks': '',
  'hdfc bank': 'hdfc',
  'sbi bank': 'sbi',
  'kotak bank': 'kotak'
};

// Wallet code mappings (matching iOS implementation exactly)
const WALLET_CODE_MAPPING: Record<string, string> = {
  'all wallets': '',
  'freecharge': 'freecharge',
  'jio money': 'jio_money',
  'phonepe': 'phonepe'
};

// Payment flow mappings (matching iOS implementation exactly)
const PAYMENT_FLOW_MAPPING: Record<string, string> = {
  'collect + intent': 'phonepe',
  'collect': 'collect',
  'intent': 'intent'
};

// Product ID mappings (matching iOS implementation exactly)
const PRODUCT_ID_MAPPING: Record<string, string> = {
  'your brand name and brand logo': '11',
  'your brand logo': '12',
  'your brand name': '13'
};

export class PaymentService {
  private static instance: PaymentService;
  private nimbblSDK: NimbblSDK;
  private isInitialized: boolean = false;
  private settingsData?: SettingsData;
  private onCheckoutResponse?: (data: any) => void;

  private constructor() {
    this.nimbblSDK = NimbblSDK.getSharedInstance();
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }


  /**
   * Set the unified checkout response callback to be called when payment completes (success or failure)
   */
  public setCheckoutResponseCallback(callback: (data: any) => void): void {
    this.onCheckoutResponse = callback;
  }

  /**
   * Initialize the Nimbbl SDK (matching iOS pattern exactly)
   */
  public async initialize(settingsData?: SettingsData): Promise<void> {
    // Always re-initialize if new settings are provided, even if already initialized
    if (this.isInitialized && !settingsData) return;

    try {
      // Store settings data for later use
      if (settingsData) {
        this.settingsData = settingsData;
        // Force re-initialization when settings change
        this.isInitialized = false;
      }

      // Get environment URL based on settings (matching iOS pattern exactly)
      const envUrl = this.getEnvironmentUrl();
      
      // Initialize with simplified config (matching new SDK format)
      const config = {
        api_base_url: envUrl, // Set environment URL like iOS
      };

      await this.nimbblSDK.initialize(config);
      
      this.isInitialized = true;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Get environment URL based on settings (matching iOS pattern exactly)
   */
  private getEnvironmentUrl(): string {
    if (!this.settingsData) {
      return API_URLS.PROD; // Default to production
    }

    // Use environment-specific URL based on the selected environment
    switch (this.settingsData.environment) {
      case 'QA':
        return this.settingsData.qaUrl || API_URLS.QA;
      case 'Pre-Prod':
        return this.settingsData.preProdUrl || API_URLS.PRE_PROD;
      case 'Prod':
        return this.settingsData.prodUrl || API_URLS.PROD;
      default:
        return API_URLS.PROD;
    }
  }

  /**
   * Setup event listeners for payment events - Using unified checkout_response event
   */

  /**
   * Process payment with validation and error handling (matching iOS pattern exactly)
   */
  public async processPayment(orderData: OrderData, settingsData?: SettingsData): Promise<{ success: boolean; errorMessage?: string }> {
    
    try {
      // Validate order data
      const validation = validateOrderData(orderData);
      if (!validation.isValid) {
        return { success: false, errorMessage: validation.errorMessage };
      }

      // Initialize SDK if not already initialized or if settings changed
      if (!this.isInitialized || settingsData) {
        await this.initialize(settingsData);
      }

      // Build order parameters matching our SDK's createShopOrder method (matching iOS pattern exactly)
      const currency = orderData.currency;
      const amount = orderData.amount;
      const productId = this.getProductIdForHeader(orderData.headerCustomisation);
      const orderLineItems = orderData.orderLineItems;
      const checkoutExperience = 'redirect';
      const paymentMode = this.getPaymentModeCode(orderData.paymentCustomisation);
      const subPaymentMode = this.getSubPaymentModeCode(orderData.subPaymentCustomisation);

      // Build user object if user details are enabled (matching iOS pattern exactly)
      let user: Record<string, any> | undefined;
      if (orderData.userDetails) {
        const trimmedName = orderData.firstName?.trim() || '';
        const trimmedNumber = orderData.mobileNumber?.trim() || '';
        const trimmedEmail = orderData.email?.trim() || '';

        // Only add user object if at least one field has data (matching iOS pattern exactly)
        if (trimmedName || trimmedNumber || trimmedEmail) {
          user = {
            email: trimmedEmail,
            name: trimmedName,
            mobile_number: trimmedNumber
          };
        }
      }
      


      // Create order using Nimbbl SDK (matching iOS createShopOrder pattern exactly)
      const orderResult = await this.nimbblSDK.createShopOrder(
        currency,
        amount,
        productId,
        orderLineItems,
        checkoutExperience,
        paymentMode,
        subPaymentMode,
        user
      );

      if (!orderResult.success) {
        throw new Error('Failed to create order');
      }

      const order = orderResult.data;
      
      // Order token is used directly in checkout options
      
      // Build checkout options matching our SDK's checkout method (matching iOS pattern exactly)
      // Use the same paymentMode that was used for order creation to ensure consistency
      const checkoutOptions = {
        orderToken: order.token,
        paymentModeCode: paymentMode, // Use the same paymentMode from order creation
        bankCode: this.getBankCode(orderData.subPaymentCustomisation),
        walletCode: this.getWalletCode(orderData.subPaymentCustomisation),
        paymentFlow: this.getPaymentFlow(orderData.subPaymentCustomisation, paymentMode) // Use paymentMode instead of recalculating
      };
      


            // Process payment using checkout method (matching iOS pattern exactly)
            const checkoutResult = await this.nimbblSDK.checkout(checkoutOptions);

            // The checkout method now returns the raw JSON response directly from native SDK
            // Call the PaymentService callback with the result
            if (this.onCheckoutResponse) {
              this.onCheckoutResponse(checkoutResult);
            } else {
            }
      
      return { 
        success: true // Always return success since the checkout process completed
      };
    } catch (error) {
      return { 
        success: false, 
        errorMessage: error instanceof Error ? error.message : 'An error occurred during payment.' 
      };
    }
  }

  /**
   * Get product ID for header (matching iOS implementation exactly)
   */
  private getProductIdForHeader(headerCustomisation: string): string {
    return PRODUCT_ID_MAPPING[headerCustomisation] || '11'; // Default to Brand Name and Logo
  }

  /**
   * Get payment mode code (matching iOS implementation exactly)
   */
  private getPaymentModeCode(paymentCustomisation: string): string {
    return PAYMENT_MODE_MAPPING[paymentCustomisation.toLowerCase()] || '';
  }

  /**
   * Get sub payment mode code (matching iOS implementation exactly)
   */
  private getSubPaymentModeCode(subPaymentCustomisation: string): string {
    return subPaymentCustomisation || '';
  }

  /**
   * Get bank code (matching iOS implementation exactly)
   */
  private getBankCode(subPaymentCustomisation: string): string {
    return BANK_CODE_MAPPING[subPaymentCustomisation.toLowerCase()] || '';
  }

  /**
   * Get wallet code (matching iOS implementation exactly)
   */
  private getWalletCode(subPaymentCustomisation: string): string {
    return WALLET_CODE_MAPPING[subPaymentCustomisation.toLowerCase()] || '';
  }

  /**
   * Get payment flow (matching iOS implementation exactly)
   */
  private getPaymentFlow(subPaymentCustomisation: string, paymentModeCode: string): string {
    if (paymentModeCode === 'UPI') {
      return PAYMENT_FLOW_MAPPING[subPaymentCustomisation.toLowerCase()] || '';
    }
    return '';
  }

  /**
   * Clean up any payment-related resources
   */
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();

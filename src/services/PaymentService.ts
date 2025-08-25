import { OrderData, SettingsData } from '../types';
import { validateOrderData } from '../utils/validation';
import { NimbblSDK, EVENTS, ENVIRONMENTS } from 'nimbbl-react-native-sdk';
import { NIMBBL_CONFIG, DEBUG_CONFIG, ENVIRONMENT_CONFIGS } from '../constants/config';

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
  private onPaymentSuccess?: (orderId?: string, transactionId?: string) => void;
  private onPaymentFailure?: (orderId?: string, errorMessage?: string) => void;
  private currentOrderId?: string;
  private currentOrderToken?: string;

  private constructor() {
    this.nimbblSDK = NimbblSDK.getSharedInstance();
    this.setupEventListeners();
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Test the native module
   */
  public async testNativeModule(): Promise<any> {
    return this.nimbblSDK.testNativeModule();
  }

  /**
   * Set the success callback to be called when payment is successful
   */
  public setPaymentSuccessCallback(callback: (orderId?: string, transactionId?: string) => void): void {
    this.onPaymentSuccess = callback;
  }

  /**
   * Set the failure callback to be called when payment fails
   */
  public setPaymentFailureCallback(callback: (orderId?: string, errorMessage?: string) => void): void {
    this.onPaymentFailure = callback;
  }

  /**
   * Initialize the Nimbbl SDK (matching iOS pattern exactly)
   */
  public async initialize(settingsData?: SettingsData): Promise<void> {
    if (this.isInitialized && !settingsData) return;

    try {
      // Store settings data for later use
      if (settingsData) {
        this.settingsData = settingsData;
      }

      // Get environment URL based on settings (matching iOS pattern exactly)
      const envUrl = this.getEnvironmentUrl();
      


      const config = {
        environment: NIMBBL_CONFIG.ENVIRONMENT,
        options: {
          ...NIMBBL_CONFIG.OPTIONS,
          api_base_url: envUrl, // Set environment URL like iOS
        },
      };

      await this.nimbblSDK.initialize(config);
      
      // Setup event listeners
      this.setupEventListeners();
      
      this.isInitialized = true;

    } catch (error) {
      console.error('Failed to initialize Nimbbl SDK:', error);
      throw error;
    }
  }

  /**
   * Get environment URL based on settings (matching iOS pattern exactly)
   */
  private getEnvironmentUrl(): string {
    if (!this.settingsData) {
      return ENVIRONMENT_CONFIGS['Prod'].api_base_url; // Default to Prod
    }

    const env = this.settingsData.environment;
    
    // Handle QA environment with custom URL support
    if (env === 'QA') {
      // Use custom QA URL if provided, otherwise use default QA URL
      if (this.settingsData.qaUrl && this.settingsData.qaUrl.trim() !== '') {
        return this.settingsData.qaUrl;
      }
      
      // Use default QA URL
      return ENVIRONMENT_CONFIGS['QA 1'].api_base_url;
    }
    
    // For other environments, use the configured URL
    return ENVIRONMENT_CONFIGS[env as keyof typeof ENVIRONMENT_CONFIGS]?.api_base_url || ENVIRONMENT_CONFIGS['Prod'].api_base_url;
  }

  /**
   * Setup event listeners for payment events - SIMPLIFIED for merchants
   */
  private setupEventListeners(): void {
    // SUCCESS: Extract order details from response
    this.nimbblSDK.addEventListener(EVENTS.PAYMENT_SUCCESS, (data: any) => {
      const orderId = data?.order_id || data?.nimbbl_order_id || this.currentOrderId || 'N/A';
      const transactionId = data?.transaction_id || data?.nimbbl_transaction_id || 'N/A';
      this.onPaymentSuccess?.(orderId, transactionId);
    });

    // FAILURE: Extract order details from response
    this.nimbblSDK.addEventListener(EVENTS.PAYMENT_FAILED, (data: any) => {
      const orderId = data?.order_id || data?.nimbbl_order_id || this.currentOrderId || 'N/A';
      // The error message is in the 'data' field from the native side
      const errorMessage = data?.data || data?.error || 'Payment failed';
      this.onPaymentFailure?.(orderId, errorMessage);
    });
    
    // Direct DeviceEventEmitter listeners as fallback
    try {
      const { DeviceEventEmitter } = require('react-native');
      
      DeviceEventEmitter.addListener('payment_failed', (data: any) => {
        const orderId = data?.order_id || data?.nimbbl_order_id || this.currentOrderId || 'N/A';
        // The error message is in the 'data' field from the native side
        const errorMessage = data?.data || data?.error || 'Payment failed';
        this.onPaymentFailure?.(orderId, errorMessage);
      });
      
      DeviceEventEmitter.addListener('payment_success', (data: any) => {
        const orderId = data?.order_id || data?.nimbbl_order_id || this.currentOrderId || 'N/A';
        const transactionId = data?.transaction_id || data?.nimbbl_transaction_id || 'N/A';
        this.onPaymentSuccess?.(orderId, transactionId);
      });
    } catch (error) {
      // Fallback listeners failed, but SDK listeners should still work
    }
  }

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
      
      // Store order details for event callbacks
      this.currentOrderId = order.order_id || order.nimbbl_order_id || `ORDER_${Date.now()}`;
      this.currentOrderToken = order.token;
      
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

      if (!checkoutResult.success) {
        throw new Error(checkoutResult.message || 'Checkout failed');
      }
      
      // Return success immediately after opening the webview
      // The actual payment result will come through event listeners
      return { success: true };
    } catch (error) {
      console.error('Payment processing error:', error);
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
  private getPaymentFlow(subPaymentCustomisation: string, paymentModeCode: string): string | undefined {
    if (paymentModeCode === 'UPI') {
      return PAYMENT_FLOW_MAPPING[subPaymentCustomisation.toLowerCase()] || '';
    }
    return undefined;
  }

  /**
   * Clean up any payment-related resources
   */
  public cleanup(): void {
    try {
      // Remove all event listeners
      this.nimbblSDK.removeAllEventListeners();
      

    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();

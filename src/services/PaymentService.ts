import { OrderData } from '../types';
import { validateOrderData } from '../utils/validation';

export class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Process payment with validation and error handling
   */
  public async processPayment(orderData: OrderData): Promise<{ success: boolean; errorMessage?: string }> {
    try {
      // Validate order data
      const validation = validateOrderData(orderData);
      if (!validation.isValid) {
        return { success: false, errorMessage: validation.errorMessage };
      }

      // Simulate payment processing
      await this.simulatePaymentProcessing();
      
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
   * Simulate payment processing delay
   */
  private async simulatePaymentProcessing(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  /**
   * Clean up any payment-related resources
   */
  public cleanup(): void {
    // Cleanup logic here
    console.log('Payment service cleanup completed');
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();

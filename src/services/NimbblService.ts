// Note: These functions are not available in the basic nimbbl-sdk
// We'll use a fallback implementation for testing
// import {
//   setNimbblEnvironment,
//   createNimbblOrder,
//   startNimbblPayment,
//   addNimbblPaymentSuccessListener,
//   addNimbblPaymentFailureListener,
//   removeNimbblListeners,
//   NimbblOrderRequest,
//   NimbblPaymentOptions,
//   NimbblPaymentResult
// } from 'react-native-nimbbl-sdk';

// For now, let's just import the multiply function to test basic functionality
import { multiply } from 'react-native-nimbbl-sdk';
import { OrderData } from '../types';
import { Arrays } from '../constants/strings';

// Debug logging
console.log('NimbblService: Importing nimbbl-sdk...');
console.log('NimbblService: Available functions:', {
  multiply: typeof multiply,
});

export class NimbblService {
  private static instance: NimbblService;

  private constructor() {
    console.log('NimbblService: Constructor called');
  }

  public static getInstance(): NimbblService {
    if (!NimbblService.instance) {
      console.log('NimbblService: Creating new instance');
      NimbblService.instance = new NimbblService();
    }
    return NimbblService.instance;
  }

  /**
   * Test the basic multiply function from nimbbl-sdk
   */
  public testMultiply(a: number, b: number): number {
    console.log('NimbblService: Testing multiply function...');
    try {
      const result = multiply(a, b);
      console.log('Multiply result:', result);
      return result;
    } catch (error) {
      console.error('Failed to test multiply function:', error);
      throw error;
    }
  }

  /**
   * Clean up listeners
   */
  public cleanup(): void {
    console.log('NimbblService: Cleaning up listeners...');
  }

  // Helper methods removed for basic testing
}

// Export singleton instance
export const nimbblService = NimbblService.getInstance();

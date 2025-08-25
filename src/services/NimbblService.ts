// Simple Nimbbl Service for testing
// This service is not used in the main payment flow
import { OrderData } from '../types';
import { Arrays } from '../constants/strings';

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
   * Test function for basic functionality
   */
  public testFunction(a: number, b: number): number {
    console.log('NimbblService: Testing function...');
    return a + b;
  }

  /**
   * Clean up listeners
   */
  public cleanup(): void {
    console.log('NimbblService: Cleaning up listeners...');
  }
}

// Export singleton instance
export const nimbblService = NimbblService.getInstance();

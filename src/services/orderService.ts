import { multiply } from 'react-native-my-sdk';

export class OrderService {
  static async createOrder(amount: string): Promise<{ orderId: string; status: string }> {
    try {
      // Simulate order creation with your SDK
      const result = await multiply(parseFloat(amount), 1);
      
      return {
        orderId: `ORDER_${Date.now()}`,
        status: 'Order Created Successfully',
      };
    } catch (error) {
      throw new Error('Failed to create order');
    }
  }
}

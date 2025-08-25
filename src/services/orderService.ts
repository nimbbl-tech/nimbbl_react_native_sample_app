// Simple Order Service for testing
// This service is not used in the main payment flow

export class OrderService {
  static async createOrder(amount: string): Promise<{ orderId: string; status: string }> {
    try {
      // Simulate order creation
      return {
        orderId: `ORDER_${Date.now()}`,
        status: 'Order Created Successfully',
      };
    } catch (error) {
      throw new Error('Failed to create order');
    }
  }
}

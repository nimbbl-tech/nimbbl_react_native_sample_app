# Simple Nimbbl SDK Integration Guide

## Quick Start for Merchants

### 1. Install the SDK
```bash
npm install nimbbl-react-native-sdk
```

### 2. Initialize the SDK
```typescript
import { NimbblSDK, EVENTS } from 'nimbbl-react-native-sdk';

const nimbblSDK = NimbblSDK.getSharedInstance();

// Initialize with your config (no credentials required)
await nimbblSDK.initialize({
  environment: 'production', // or 'sandbox'
  options: {
    api_base_url: 'https://api.nimbbl.tech'
  }
});
```

### 3. Set Up Event Listeners
```typescript
// SUCCESS: Handle successful payments
nimbblSDK.addEventListener(EVENTS.PAYMENT_SUCCESS, (data) => {
  console.log('Payment Success:', data);
  // Navigate to success screen or show success message
  navigateToSuccessScreen();
});

// FAILURE: Handle failed payments
nimbblSDK.addEventListener(EVENTS.PAYMENT_FAILED, (data) => {
  console.log('Payment Failed:', data);
  // Show error message or retry option
  showErrorMessage('Payment failed. Please try again.');
});
```

### 4. Create Order and Start Payment
```typescript
// Create order
const orderResult = await nimbblSDK.createShopOrder(
  'INR',           // currency
  '100',           // amount (as string)
  '11',            // productId (for header customization)
  true,            // orderLineItems
  'redirect',      // checkoutExperience
  '',              // paymentMode (empty for all modes)
  'all banks',     // subPaymentMode
  {                // user details (optional)
    email: 'user@example.com',
    name: 'John Doe',
    mobile_number: '1234567890'
  }
);

// Start checkout
const checkoutResult = await nimbblSDK.checkout({
  orderToken: orderResult.data.token,
  paymentModeCode: '',
  bankCode: '',
  walletCode: '',
  paymentFlow: ''
});
```

## Complete Example Component

```typescript
import React, { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import { NimbblSDK, EVENTS } from 'nimbbl-react-native-sdk';

const PaymentComponent = () => {
  useEffect(() => {
    initializeSDK();
    setupEventListeners();
  }, []);

  const initializeSDK = async () => {
    const nimbblSDK = NimbblSDK.getSharedInstance();
    await nimbblSDK.initialize({
      environment: 'production',
      options: { api_base_url: 'https://api.nimbbl.tech' }
    });
  };

  const setupEventListeners = () => {
    const nimbblSDK = NimbblSDK.getSharedInstance();
    
    nimbblSDK.addEventListener(EVENTS.PAYMENT_SUCCESS, (data) => {
      Alert.alert('Success', 'Payment completed successfully!');
    });

    nimbblSDK.addEventListener(EVENTS.PAYMENT_FAILED, (data) => {
      Alert.alert('Failed', 'Payment failed. Please try again.');
    });
  };

  const handlePayment = async () => {
    try {
      const nimbblSDK = NimbblSDK.getSharedInstance();
      
      // Create order
      const orderResult = await nimbblSDK.createShopOrder(
        'INR', '100', '11', true, 'redirect', '', 'all banks',
        { email: 'user@example.com', name: 'John Doe', mobile_number: '1234567890' }
      );

      // Start checkout
      await nimbblSDK.checkout({
        orderToken: orderResult.data.token,
        paymentModeCode: '',
        bankCode: '',
        walletCode: '',
        paymentFlow: ''
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to start payment');
    }
  };

  return (
    <View>
      <Button title="Pay ₹100" onPress={handlePayment} />
    </View>
  );
};

export default PaymentComponent;
```

## That's It! 🎉

Your integration is complete. The SDK handles all the complex payment flow, and you just need to:
1. Initialize the SDK
2. Set up success/failure event listeners
3. Create order and start checkout
4. Handle the results in your event listeners

The SDK will automatically:
- Open the payment webview
- Handle all payment methods
- Process the payment
- Send success/failure events back to your app

# Simple Nimbbl SDK Integration Guide

## Quick Start for Merchants

### 1. Install the SDK
```bash
npm install nimbbl-mobile-react-native-sdk
```

### 2. Initialize the SDK
```typescript
import { NimbblSDK } from 'nimbbl-mobile-react-native-sdk';

const nimbblSDK = NimbblSDK.getSharedInstance();

// Initialize with default configuration (production environment)
await nimbblSDK.initialize();

// OR initialize with custom configuration
await nimbblSDK.initialize({
  environment: 'production', // or 'development', 'staging'
  options: {
    api_base_url: 'https://api.nimbbl.tech',
    timeout: 30000,
    enable_logging: false, // Set to true for development/debugging
    enable_analytics: true
  }
});
```

### 3. Set Up Unified Event Listener
```typescript
// UNIFIED: Handle all payment responses (success, failure, cancelled)
nimbblSDK.addCheckoutResponseListener((data) => {
  if (data.status === 'success') {
    console.log('Payment Success:', data);
    // Navigate to success screen or show success message
    navigateToSuccessScreen();
  } else {
    console.log('Payment Failed:', data);
    // Show error message or retry option
    showErrorMessage('Payment failed. Please try again.');
  }
});
```

### 4. Start Payment
```typescript
// Start checkout with your order token (obtained from your backend)
const checkoutResult = await nimbblSDK.checkout({
  orderToken: 'YOUR_ORDER_TOKEN', // Get this from your backend
  paymentModeCode: '', // Leave empty for all payment modes
  bankCode: '',        // Leave empty for all banks
  walletCode: '',      // Leave empty for all wallets
  paymentFlow: ''      // Leave empty for default flow
});

// The actual payment result will come through the event listener
console.log('Checkout initiated:', checkoutResult);
```

## Complete Example Component

```typescript
import React, { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import { NimbblSDK } from 'nimbbl-mobile-react-native-sdk';

const PaymentComponent = () => {
  useEffect(() => {
    initializeSDK();
    setupEventListeners();
  }, []);

  const initializeSDK = async () => {
    const nimbblSDK = NimbblSDK.getSharedInstance();
    // Initialize with default configuration (production environment)
    await nimbblSDK.initialize();
  };

  const setupEventListeners = () => {
    const nimbblSDK = NimbblSDK.getSharedInstance();
    
    // Use unified event listener for all payment responses
    nimbblSDK.addCheckoutResponseListener((data) => {
      if (data.status === 'success') {
        Alert.alert('Success', 'Payment completed successfully!');
        // Navigate to success screen
      } else {
        Alert.alert('Failed', 'Payment failed. Please try again.');
        // Show retry option
      }
    });
  };

  const handlePayment = async () => {
    try {
      const nimbblSDK = NimbblSDK.getSharedInstance();
      
      // Start checkout with order token from your backend
      await nimbblSDK.checkout({
        orderToken: 'YOUR_ORDER_TOKEN', // Get this from your backend
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
1. Initialize the SDK (with default production configuration)
2. Set up unified checkout response listener
3. Start checkout with your order token
4. Handle the results in your event listener

## Key Features (v1.2.0)

- ✅ **Simplified Integration**: No credentials required, production-ready defaults
- ✅ **Unified Event Handling**: Single listener for all payment responses
- ✅ **Cross-Platform**: Works identically on iOS and Android
- ✅ **Production Ready**: Enhanced stability and performance
- ✅ **Latest Native SDKs**: iOS 2.0.4, Android 4.0.3

The SDK will automatically:
- Open the payment webview
- Handle all payment methods (cards, UPI, netbanking, wallets)
- Process the payment securely
- Send unified response events back to your app
- Handle errors and edge cases gracefully

## Need Help?

- 📖 **Full Documentation**: Check the SDK's README.md for detailed API reference
- 🔧 **Setup Guide**: See the SDK's SETUP.md for development and configuration options
- 📱 **Sample App**: This repository includes a complete working example
- 🆘 **Support**: Contact support@nimbbl.biz for assistance

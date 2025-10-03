# Nimbbl React Native SDK Sample App

This is a **production-ready sample app** demonstrating how to integrate the **Nimbbl React Native SDK** for payment processing in your React Native application.

## 🚀 Quick Integration Guide

For merchants who want to integrate the Nimbbl SDK quickly, see our **[Simple Integration Guide](SIMPLE_INTEGRATION_EXAMPLE.md)**.

## 📱 What This Sample App Demonstrates

- ✅ **Complete Payment Integration** - End-to-end payment flow
- ✅ **Unified Event Handling** - Success/failure response handling
- ✅ **Multiple Payment Methods** - Cards, UPI, Netbanking, Wallets
- ✅ **UI Customization** - Payment options and user interface
- ✅ **Settings Configuration** - Environment and payment settings
- ✅ **Error Handling** - Robust error management
- ✅ **Production Ready** - Uses published npm package

## 🏃‍♂️ Running the Sample App

### Prerequisites
- Node.js >= 16
- React Native development environment set up
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Quick Start

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# In a new terminal, run the app
npm run ios     # For iOS
npm run android # For Android
```


## 🔧 Integration Examples

### Basic Payment Flow
```typescript
import { NimbblSDK } from 'nimbbl-mobile-react-native-sdk';

const nimbblSDK = NimbblSDK.getSharedInstance();

// Initialize SDK
await nimbblSDK.initialize();

// Set up payment response handler
nimbblSDK.addCheckoutResponseListener((data) => {
  if (data.status === 'success') {
    // Handle successful payment
  } else {
    // Handle failed payment
  }
});

// Start payment
await nimbblSDK.checkout({
  orderToken: 'YOUR_ORDER_TOKEN'
});
```

## 📚 Key Integration Points

1. **SDK Initialization** - See `src/services/PaymentService.ts`
2. **Payment Processing** - See `src/hooks/usePayment.ts`
3. **Event Handling** - See `src/screens/MainScreen.tsx`
4. **Result Display** - See `src/screens/PaymentResultScreen.tsx`
5. **Settings Configuration** - See `src/screens/SettingsScreen.tsx`

## 🆘 Need Help?

- 📖 **Integration Guide**: [SIMPLE_INTEGRATION_EXAMPLE.md](SIMPLE_INTEGRATION_EXAMPLE.md)
- 📱 **SDK Documentation**: [SDK README](../nimbbl_mobile_kit_react_native_sdk/README.md)
- 🆘 **Support**: Contact support@nimbbl.biz

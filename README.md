# Nimbbl React Native SDK Sample App

**🎉 First Release - Production Ready!**

This is the official sample application for the **Nimbbl React Native SDK v1.3.2** - demonstrating how to integrate the Nimbbl payment gateway into your React Native application.

## 🚀 Quick Integration Guide

For merchants who want to integrate the Nimbbl SDK quickly, see our **[Simple Integration Guide](SIMPLE_INTEGRATION_EXAMPLE.md)**.

## 📦 SDK Integration into Your App

### Step 1: Install the SDK

```bash
npm install nimbbl-mobile-react-native-sdk
```

### Step 2: iOS Setup

```bash
cd ios && pod install
```

### Step 3: Android Setup

No additional setup required - the SDK uses autolinking.

### Step 4: Basic Integration

```typescript
import { NimbblSDK } from 'nimbbl-mobile-react-native-sdk';

// Initialize the SDK
const nimbblSDK = NimbblSDK.getSharedInstance();
await nimbblSDK.initialize();

// Use in your payment component
const handlePayment = async () => {
  try {
    const result = await nimbblSDK.checkout({
      orderToken: 'YOUR_ORDER_TOKEN', // Get from your backend
      paymentModeCode: 'UPI', // Optional: 'UPI', 'Netbanking', 'Wallet', 'card' or '' for all
      bankCode: 'hdfc', // Optional: Bank code for specific bank or '' for all banks
      walletCode: 'phonepe', // Optional: Wallet code for specific wallet or '' for all wallets
      paymentFlow: 'phonepe' // Optional: 'phonepe', 'collect', 'intent' or '' for default
    });
    
    // Handle payment result
    if (result.status === 'success') {
      // Payment successful
      console.log('Payment successful:', result);
    } else {
      // Payment failed
      console.log('Payment failed:', result);
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

### Step 5: Required Dependencies

The SDK requires these dependencies (already included in this sample app):

```json
{
  "dependencies": {
    "@react-navigation/native": "^7.1.18",
    "@react-navigation/native-stack": "^7.3.27",
    "react-native-screens": "^4.16.0",
    "react-native-safe-area-context": "^5.6.1",
    "react-native-webview": "^13.15.0",
    "@react-native-async-storage/async-storage": "^2.2.0"
  }
}
```

**Note**: We use `@react-navigation/native-stack` instead of `@react-navigation/stack` to avoid the `react-native-gesture-handler` dependency.






## ✨ First Release Features

- ✅ **Production Ready** - Built with production best practices and comprehensive testing
- ✅ **Cross-Platform** - Identical behavior on iOS and Android
- ✅ **Modern Architecture** - React Navigation, TypeScript, and clean code structure
- ✅ **Latest Native SDKs** - Built on iOS 2.0.16 and Android 4.0.9
- ✅ **Unified API** - Single API for both platforms with consistent response handling

## 📱 What This Sample App Demonstrates

- ✅ **Complete Payment Integration** - End-to-end payment flow
- ✅ **Unified Event Handling** - Success/failure response handling
- ✅ **Multiple Payment Methods** - Cards, UPI, Netbanking, Wallets
- ✅ **UI Customization** - Payment options and user interface
- ✅ **Settings Configuration** - Environment and payment settings
- ✅ **Error Handling** - Robust error management
- ✅ **React Navigation** - Modern multi-screen navigation
- ✅ **TypeScript Support** - Full type safety and IntelliSense

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

// Start payment and handle response
const checkoutResult = await nimbblSDK.checkout({
  orderToken: 'YOUR_ORDER_TOKEN', // Required: Get this from your backend
  paymentModeCode: 'UPI', // Optional: 'UPI', 'Netbanking', 'Wallet', 'card' or '' for all
  bankCode: 'hdfc', // Optional: Bank code for specific bank or '' for all banks
  walletCode: 'phonepe', // Optional: Wallet code for specific wallet or '' for all wallets
  paymentFlow: 'phonepe' // Optional: 'phonepe', 'collect', 'intent' or '' for default
});

// Handle the response
if (checkoutResult.status === 'success') {
  // Handle successful payment
} else {
  // Handle failed payment
}
```

## 📚 Key Integration Points

1. **SDK Initialization** - See `src/services/PaymentService.ts`
2. **Payment Processing** - See `src/hooks/usePayment.ts`
3. **Event Handling** - See `src/screens/MainScreen.tsx`
4. **Result Display** - See `src/screens/PaymentResultScreen.tsx`
5. **Settings Configuration** - See `src/screens/SettingsScreen.tsx`

## 📋 Recent Updates (v1.3.2)

### 🚀 Major Improvements
- **Updated Native SDKs**: Upgraded to iOS SDK v2.0.16 and Android SDK v4.0.9 for improved stability and features
- **Fixed Android White Screen Issue**: Resolved critical white screen issue on Android payment result screen
- **Cross-Platform Consistency**: Android and iOS now have identical response formats and behavior
- **Clean Codebase**: Removed all debug logs, test code, and unused variables for production readiness
- **Enhanced Error Handling**: Better error handling and fallback mechanisms
- **Simplified Architecture**: Streamlined Android native module communication

### 🔧 Technical Changes
- **Native SDK Updates**: Latest iOS (2.0.16) and Android (4.0.9) SDK integrations
- **Android SDK Integration**: Fixed Android SDK response handling to match iOS behavior
- **Response Format**: Standardized Android response format to match iOS
- **Code Quality**: Removed all debug logs and unused code across both SDK and sample app
- **Performance**: Removed unnecessary Activity result serialization/deserialization

## 🆘 Need Help?

- 📖 **Integration Guide**: [SIMPLE_INTEGRATION_EXAMPLE.md](SIMPLE_INTEGRATION_EXAMPLE.md)
- 📱 **SDK Documentation**: [SDK README](../nimbbl_mobile_kit_react_native_sdk/README.md)
- 🆘 **Support**: Contact support@nimbbl.biz

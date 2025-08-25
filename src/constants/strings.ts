export const Strings = {
  // App
  appName: 'Nimbbl',
  
  // Settings Screen
  settingsTitle: 'Settings',
  selectEnvironment: 'Select Environment',
  selectExperience: 'Select Experience',
  qaUrlHint: 'Enter QA environment URL',
  settingsSavedSuccess: 'Settings saved successfully!',
  cancel: 'Cancel',
  lblDone: 'Done',
  
  // Order Success Page
  orderSuccessTitle: 'Order Success',
  orderIdLabel: 'Order id:- %s',
  statusLabel: 'Status:- %s',
  
  // Order Creation
  orderCreationFailed: 'Failed: %s',
  orderCreatedNullResponse: 'Order created but response body is null',
  unableToCreateOrder: 'Unable to create order',
  unableToCreateOrderError: 'Unable to create order,\n%s',
  paymentSuccessMessage: 'OrderId=%s, Status=%s',
  
  // Payment Flow
  noInternet: 'No internet connection',
  inputSentInvalid: 'Invalid input sent',
  errorInUpdateOrder: 'Error updating order',
  
  // Order Create Activity Layout
  byNimbbl: 'by nimbbl.',
  paperPlane: 'paper plane.',
  transactionInfo: 'this is a real transaction, any amount deducted will refunded within 7 working days',
  
  orderLineItems: 'order line items and personalised payment options',
  headerCustomisation: 'header customisation',
  paymentCustomisation: 'payment customisation',
  subpaymentMode: 'subpayment mode',
  userDetails: 'user details?',
  payNow: 'pay now',
  creatingOrder: 'creating order...',
  nameHint: 'name',
  numberHint: 'number',
  emailHint: 'email id',
  copyrightText: '© 2025 nimbbl by bigital technologies pvt ltd',
  
  // Main Activity
  helloWorld: 'Hello World!',
  
  // Default Values
  defaultProd: 'Prod',
  defaultNative: 'Native',
  defaultWebview: 'Webview',
  
  // Product Headers
  brandNameAndLogo: 'your brand name and brand logo',
  brandLogo: 'your brand logo',
  brandName: 'your brand name',
  
  // Payment Modes
  allPaymentModes: 'all payments modes',
  netbanking: 'netbanking',
  wallet: 'wallet',
  card: 'card',
  upi: 'upi',
  
  // Bank Names
  allBanks: 'all banks',
  hdfcBank: 'hdfc bank',
  sbiBank: 'sbi bank',
  kotakBank: 'kotak bank',
  
  // Wallet Names
  allWallets: 'all wallets',
  freecharge: 'freecharge',
  jioMoney: 'jio money',
  phonepe: 'phonepe',
  
  // UPI Modes
  collectIntent: 'collect + intent',
  collect: 'collect',
  intent: 'intent',
  
  // Error Messages
  networkError: 'Network error occurred. Please check your connection and try again.',
  invalidResponseFormat: 'Invalid response format received from server.',
  unsupportedPaymentMode: 'Unsupported payment mode selected.',
} as const;

export const Arrays = {
  // Experience Modes
  appExperienceMode: ['Native', 'Webview'],
  
  // Currency Formats
  appCurrencyFormat: ['INR', 'USD', 'CAD', 'EUR'],
  
  // Header Customisation Options
  optionEnabled: ['your brand name and brand logo', 'your brand logo'],
  optionDisabled: ['your brand name'],
  
  // Payment Types
  paymentType: ['all payments modes', 'netbanking', 'wallet', 'card', 'upi'],
  paymentTypeCard: ['card'],
  
  // Sub Payment Types
  subPaymentTypeNetbanking: ['all banks', 'hdfc bank', 'sbi bank', 'kotak bank'],
  subPaymentTypeWallet: ['all wallets', 'freecharge', 'jio money', 'phonepe'],
  subPaymentTypeUpi: ['collect + intent', 'collect', 'intent'],
  
  // Environments (matching iOS app exactly)
  appEnvironments: ['Prod', 'Pre-Prod', 'QA'],
  
  // Test Merchants
  appTestMerchants: [
    'Native Config',
    'RazorPay Config', 
    'PayU Config', 
    'CashFree Config',
    'Paytm Config',
    'PhonePe Config',
    'Amazon Pay Config',
    'Mobikwik Config',
    'FreeCharge Config',
    'Ola Money Config',
    'Airtel Money Config',
    'Jio Money Config',
    'ICICI Mobile Config',
    'HDFC Pay Config',
    'SBI Yono Config',
    'Axis Mobile Config',
    'Kotak Mobile Config',
    'Union Bank Mobile Config'
  ],
} as const;

// Dropdown relationship mappings
export const DropdownRelationships = {
  // When payment type changes, update sub payment type
  paymentTypeToSubPayment: {
    'all payments modes': 'all banks',
    'netbanking': 'all banks',
    'wallet': 'all wallets', 
    'card': 'card',
    'upi': 'collect + intent'
  },
  
  // Sub payment options for each payment type
  subPaymentOptions: {
    'all payments modes': Arrays.subPaymentTypeNetbanking,
    'netbanking': Arrays.subPaymentTypeNetbanking,
    'wallet': Arrays.subPaymentTypeWallet,
    'card': Arrays.paymentTypeCard,
    'upi': Arrays.subPaymentTypeUpi
  }
} as const;

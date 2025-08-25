/**
 * Nimbbl SDK Configuration
 * No credentials required - matches iOS sample app pattern
 * The SDK uses pre-configured authentication like the iOS version
 */

export const NIMBBL_CONFIG = {
  // Environment: 'sandbox' for testing, 'production' for live
  ENVIRONMENT: 'sandbox' as const,
  
  // SDK options
  OPTIONS: {
    timeout: 30000,
    enable_logging: true,
    enable_analytics: true,
  },
  
  // Bridge configuration
  BRIDGE_CONFIG: {
    debug_mode: true,
    event_timeout: 30000,
    max_retries: 3,
  },
  
  // WebView options
  WEBVIEW_OPTIONS: {
    theme: 'light' as const,
    language: 'en',
    show_close_button: true,
    enable_loader: true,
  },
};

/**
 * Environment-specific configurations (matching iOS pattern exactly)
 */
export const ENVIRONMENT_CONFIGS = {
  'QA 1': {
    api_base_url: 'https://qa1api.nimbbl.tech/',
    webview_url: 'https://qa1checkout.nimbbl.tech/',
  },
  'QA 2': {
    api_base_url: 'https://qa2api.nimbbl.tech/',
    webview_url: 'https://qa2checkout.nimbbl.tech/',
  },
  'Pre-Prod': {
    api_base_url: 'https://apipp.nimbbl.tech/',
    webview_url: 'https://checkoutpp.nimbbl.tech/',
  },
  'Prod': {
    api_base_url: 'https://api.nimbbl.tech/',
    webview_url: 'https://checkout.nimbbl.tech/',
  },
  // Legacy support
  QA: {
    api_base_url: 'https://qa1api.nimbbl.tech/',
    webview_url: 'https://qa1checkout.nimbbl.tech/',
  },
  sandbox: {
    api_base_url: 'https://api-sandbox.nimbbl.tech',
    webview_url: 'https://checkout-sandbox.nimbbl.tech',
  },
  production: {
    api_base_url: 'https://api.nimbbl.tech',
    webview_url: 'https://checkout.nimbbl.tech',
  },
};

/**
 * Debug configuration (matching iOS pattern)
 */
export const DEBUG_CONFIG = {
  debugPrintEnabled: true, // Set to false in production
};

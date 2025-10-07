import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { PaymentResultData } from '../types';
import { ScreenHeader } from '../components/ScreenHeader';

type PaymentResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentResult'>;
type PaymentResultScreenRouteProp = RouteProp<RootStackParamList, 'PaymentResult'>;

interface PaymentResultScreenProps {
  navigation: PaymentResultScreenNavigationProp;
  route: PaymentResultScreenRouteProp;
}

const PaymentResultScreen: React.FC<PaymentResultScreenProps> = ({
  navigation,
  route
}) => {
  const { paymentData } = route.params;
  

  // Provide default values if paymentData is undefined
  const defaultPaymentData: PaymentResultData = {
    orderId: 'N/A',
    status: 'failed',
    message: 'No payment data received',
    amount: 0,
    currency: 'INR',
    isEncrypted: false,
  };

  const [parsedData, setParsedData] = useState<PaymentResultData>(paymentData || defaultPaymentData);

  useEffect(() => {
    try {
      // Parse the raw data properly
      const parsePaymentData = (rawData: any): PaymentResultData => {
        try {
          if (!rawData) {
            return defaultPaymentData;
          }

          // Check for encrypted response
          if (rawData.encrypted_response) {
            return {
              orderId: rawData.order_id || rawData.nimbbl_order_id || 'N/A',
              status: 'success' as const,
              message: 'Payment successful. Encrypted response received.',
              isEncrypted: true,
              encryptedResponse: rawData.encrypted_response,
            };
          }
          
          // Parse regular payment data
          // Parse the nested order data if it exists
          let orderData = null;
          if (rawData.order) {
            if (typeof rawData.order === 'object') {
              // iOS sends order as an object
              orderData = rawData.order;
            } else if (typeof rawData.order === 'string') {
              // Android sends order as a JSON string - parse it
              try {
                orderData = JSON.parse(rawData.order);
              } catch (parseError) {
                orderData = null;
              }
            }
          }
          
          const parsedResult = {
            orderId: rawData.order_id || rawData.nimbbl_order_id || 'N/A',
            transactionId: rawData.transaction_id || rawData.nimbbl_transaction_id,
            status: (rawData.status === 'success' || rawData.status === 'completed') ? 'success' as const : 'failed' as const,
            message: rawData.message || 'Payment processed',
            amount: rawData.amount || orderData?.total_amount || orderData?.grand_total,
            currency: rawData.currency || orderData?.currency || 'INR',
            isEncrypted: false,
            // Additional fields from rawData
            invoiceId: rawData.invoice_id || orderData?.invoice_id,
            orderDate: rawData.order_date || orderData?.order_date,
            reason: rawData.reason || orderData?.cancellation_reason,
            cancellationReason: rawData.cancellation_reason || orderData?.cancellation_reason,
            attempts: rawData.attempts || orderData?.attempts,
            referrerPlatform: rawData.referrer_platform || orderData?.referrer_platform,
            referrerPlatformVersion: rawData.referrer_platform_version || orderData?.referrer_platform_version,
            deviceName: rawData.device_name || orderData?.device?.device_name,
            deviceOsName: rawData.device_os_name || orderData?.device?.os_name,
            deviceIpAddress: rawData.device_ip_address || orderData?.device?.ip_address,
            shippingCity: rawData.shipping_city || orderData?.shipping_address?.city,
            shippingState: rawData.shipping_state || orderData?.shipping_address?.state,
            shippingCountry: rawData.shipping_country || orderData?.shipping_address?.country,
            shippingPincode: rawData.shipping_pincode || orderData?.shipping_address?.pincode,
          };

          return parsedResult;
        } catch (parseError) {
          return {
            ...defaultPaymentData,
            message: 'Error parsing payment data',
          };
        }
      };

      const parsed = parsePaymentData(paymentData);
      setParsedData(parsed);
    } catch (error) {
      setParsedData({
        ...defaultPaymentData,
        message: 'Error processing payment result',
      });
    }
  }, [paymentData]);

  const handleBackToHome = () => {
    try {
      navigation.navigate('Main');
    } catch (error) {
      // Navigation error - ignore
    }
  };

  const handleBackPress = () => {
    try {
      navigation.goBack();
    } catch (error) {
      // Navigation error - ignore
    }
  };

  const getStatusIcon = () => {
    switch (parsedData.status) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'cancelled':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const getStatusColor = () => {
    switch (parsedData.status) {
      case 'success':
        return '#34C759'; // Green
      case 'failed':
        return '#FF3B30'; // Red
      case 'cancelled':
        return '#FF9500'; // Orange
      default:
        return '#8E8E93'; // Gray
    }
  };

  const getStatusTitle = () => {
    if (parsedData.isEncrypted) {
      return 'Encrypted Response';
    }

    switch (parsedData.status) {
      case 'success':
        return 'Payment Successful';
      case 'failed':
        return 'Payment Failed';
      case 'cancelled':
        return 'Payment Cancelled';
      default:
        return 'Payment Status';
    }
  };

  const getStatusMessage = () => {
    if (parsedData.isEncrypted) {
      return 'Encrypted response received. Please handle decryption on your server.';
    }

    if (parsedData.message) {
      return parsedData.message;
    }

    switch (parsedData.status) {
      case 'success':
        return 'Your payment has been processed successfully';
      case 'failed':
        return 'Your payment could not be processed';
      case 'cancelled':
        return 'Payment was cancelled';
      default:
        return `Payment status: ${parsedData.status}`;
    }
  };


  const formatOrderDate = (orderDate?: string): string => {
    if (!orderDate || orderDate === 'null' || orderDate === '') return '';

    try {
      // Simple date formatting - show only date and time part
      return orderDate.substring(0, 19);
    } catch (error) {
      return orderDate;
    }
  };

  const cleanValue = (value?: string | number): string => {
    try {
      if (value === null || value === undefined || value === 'null' || value === '') {
        return '';
      }
      return String(value);
    } catch (error) {
      return '';
    }
  };

  const buildAdditionalDetails = (): string => {
    try {
      const details: string[] = [];

      // Only build details if we have valid parsed data and it's not encrypted
      if (!parsedData || parsedData.isEncrypted) {
        return '';
      }

      const reason = cleanValue(parsedData.reason);
      if (reason !== '') {
        details.push(`Reason: ${reason}`);
      }

      const cancellationReason = cleanValue(parsedData.cancellationReason);
      if (cancellationReason !== '') {
        details.push(`Cancellation Reason: ${cancellationReason}`);
      }

      const attempts = cleanValue(parsedData.attempts);
      if (attempts !== '') {
        details.push(`Attempts: ${attempts}`);
      }

      const platform = cleanValue(parsedData.referrerPlatform);
      const platformVersion = cleanValue(parsedData.referrerPlatformVersion);
      if (platform !== '') {
        details.push(`Platform: ${platform} ${platformVersion !== '' ? platformVersion : ''}`);
      }

      const deviceName = cleanValue(parsedData.deviceName);
      const deviceOs = cleanValue(parsedData.deviceOsName);
      if (deviceName !== '') {
        details.push(`Device: ${deviceName} ${deviceOs !== '' ? `(${deviceOs})` : ''}`);
      }

      const ipAddress = cleanValue(parsedData.deviceIpAddress);
      if (ipAddress !== '') {
        details.push(`IP Address: ${ipAddress}`);
      }

      const shippingCity = cleanValue(parsedData.shippingCity);
      const shippingState = cleanValue(parsedData.shippingState);
      const shippingCountry = cleanValue(parsedData.shippingCountry);
      const shippingPincode = cleanValue(parsedData.shippingPincode);
      if (shippingCity !== '') {
        const addressParts = [shippingCity, shippingState !== '' ? shippingState : '', shippingCountry !== '' ? shippingCountry : '', shippingPincode !== '' ? shippingPincode : ''].filter(part => part !== '');
        details.push(`Shipping Address: ${addressParts.join(', ')}`);
      }

      return details.join('\n\n');
    } catch (error) {
      return '';
    }
  };

  const additionalDetails = buildAdditionalDetails();


         // Unified render for both platforms
         try {
           return (
             <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScreenHeader
          title="Order Success"
          onBackPress={handleBackPress}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Status Card */}
          <View style={styles.statusCard}>
            <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
            <Text style={[styles.statusTitle, { color: getStatusColor() }]}>
              {getStatusTitle()}
            </Text>
            <Text style={styles.statusMessage}>
              {getStatusMessage()}
            </Text>
          </View>

          {/* Order Details Card */}
          {!parsedData.isEncrypted && (
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Order Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order ID</Text>
                <Text style={styles.detailValue}>{cleanValue(parsedData.orderId)}</Text>
      </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={[styles.detailValue, { color: getStatusColor() }]}>
                  {parsedData.status.toUpperCase()}
        </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount</Text>
                <Text style={styles.detailValue}>
                  {cleanValue(parsedData.currency || 'INR')} {cleanValue(parsedData.amount)}
        </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Invoice ID</Text>
                <Text style={styles.detailValue}>{cleanValue(parsedData.invoiceId)}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction ID</Text>
                <Text style={styles.detailValue}>{cleanValue(parsedData.transactionId)}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order Date</Text>
                <Text style={styles.detailValue}>{formatOrderDate(parsedData.orderDate)}</Text>
              </View>
            </View>
          )}

          {/* Additional Details Card */}
          {!parsedData.isEncrypted && additionalDetails && (
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Additional Details</Text>
              <Text style={styles.additionalDetailsText}>{additionalDetails}</Text>
            </View>
          )}

          {/* Encrypted Response Card */}
          {parsedData.isEncrypted && (
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Encrypted Response</Text>
              <Text style={styles.encryptedText}>
                This response is encrypted and needs to be decrypted on your server.
              </Text>
              <Text style={styles.encryptedData}>
                {parsedData.encryptedResponse?.substring(0, 100)}...
          </Text>
        </View>
      )}

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleBackToHome}
            >
              <Text style={styles.primaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
      </View>
        </ScrollView>

      {/* Bottom Safe Area */}
      <SafeAreaView edges={['bottom']} />
      </SafeAreaView>
    );
  } catch (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error rendering payment result: {String(error)}</Text>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'android' ? 32 : 24,
    flexGrow: 1,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statusIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    ...Platform.select({
      android: {
        fontFamily: 'Roboto-Bold',
      },
    }),
  },
  statusMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    ...Platform.select({
      android: {
        fontFamily: 'Roboto-Bold',
      },
    }),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'right',
    flex: 1,
  },
  additionalDetailsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  encryptedText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  encryptedData: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'monospace',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginTop: 8,
  },
  primaryButton: {
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default PaymentResultScreen;
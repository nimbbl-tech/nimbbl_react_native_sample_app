import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { ScreenHeader } from '../components/ScreenHeader';

interface PaymentResultData {
  orderId: string;
  transactionId?: string;
  status: 'success' | 'failed' | 'cancelled';
  message?: string;
  amount?: number;
  currency?: string;
  // Additional fields from Android sample app
  invoiceId?: string;
  orderDate?: string;
  reason?: string;
  cancellationReason?: string;
  attempts?: number;
  referrerPlatform?: string;
  referrerPlatformVersion?: string;
  deviceName?: string;
  deviceOsName?: string;
  deviceIpAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  shippingPincode?: string;
  isEncrypted?: boolean;
  encryptedResponse?: string;
}

interface PaymentResultScreenProps {
  paymentData: PaymentResultData;
  onBackToHome?: () => void;
}

const PaymentResultScreen: React.FC<PaymentResultScreenProps> = ({ 
  paymentData, 
  onBackToHome 
}) => {

  const [parsedData, setParsedData] = useState<PaymentResultData>(paymentData);

  useEffect(() => {
    // Parse additional data if it's a string (from native response)
    if (typeof paymentData === 'string') {
      try {
        const parsed = JSON.parse(paymentData);
        setParsedData(parsed);
      } catch (error) {
        setParsedData(paymentData);
      }
    } else {
      setParsedData(paymentData);
    }
  }, [paymentData]);

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
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
    if (value === null || value === undefined || value === 'null' || value === '') {
      return '';
    }
    return String(value);
  };

  const buildAdditionalDetails = (): string => {
    const details: string[] = [];
    
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
  };

  const additionalDetails = buildAdditionalDetails();

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Order Success" 
        onBackPress={handleBackToHome} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
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
  buttonContainer: {
    marginTop: 8,
  },
  primaryButton: {
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default PaymentResultScreen;
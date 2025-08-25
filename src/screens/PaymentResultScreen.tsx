import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/globalStyles';
import { ScreenHeader } from '../components/ScreenHeader';
import { Colors } from '../constants/colors';

interface PaymentResultScreenProps {
  isSuccess?: boolean;
  orderId?: string;
  transactionId?: string;
  errorMessage?: string;
  onDone?: () => void;
  onTryAgain?: () => void;
  onBackPress?: () => void;
}

const PaymentResultScreen: React.FC<PaymentResultScreenProps> = ({
  isSuccess = false,
  orderId = '',
  transactionId = '',
  errorMessage = '',
  onDone,
  onTryAgain,
  onBackPress,
}) => {
  const statusColor = isSuccess ? '#34C759' : '#FF3B30';
  const statusBackgroundColor = isSuccess ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)';
  const statusBorderColor = isSuccess ? '#34C759' : '#FF3B30';
  const statusIcon = isSuccess ? '✅' : '❌';
  const statusText = isSuccess ? 'Payment Successful!' : 'Payment Failed';
  const titleText = isSuccess ? 'Order Success' : 'Payment Status';

  return (
    <View style={globalStyles.container}>
      <ScreenHeader title={titleText} onBackPress={onBackPress || onDone || onTryAgain || (() => {})} />
      
      <View style={styles.content}>

      {/* Status Container */}
      <View style={[styles.statusContainer, { 
        backgroundColor: statusBackgroundColor,
        borderColor: statusBorderColor 
      }]}>
        <Text style={styles.statusIcon}>{statusIcon}</Text>
        <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
      </View>

      {/* Order ID */}
      <Text style={styles.orderIdText}>Order ID: {orderId}</Text>

      {/* Transaction ID or Error Message */}
      {isSuccess ? (
        <Text style={styles.transactionText}>
          Status: Success{'\n'}Txn ID: {transactionId}
        </Text>
      ) : (
        <Text style={[styles.transactionText, { color: '#FF3B30' }]}>
          Error: {errorMessage || 'Payment failed'}
        </Text>
      )}



      {/* Support Info for Failed Payments */}
      {!isSuccess && (
        <View style={styles.supportContainer}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            If you're experiencing issues, please contact our support team.
          </Text>
          <Text style={styles.supportEmail}>support@nimbbl.biz</Text>
        </View>
      )}

      </View>

      {/* Bottom Safe Area */}
      <SafeAreaView edges={['bottom']} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statusContainer: {
    marginTop: 32,
    marginHorizontal: 20,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statusIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
  transactionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginTop: 24,
    marginHorizontal: 20,
  },

  supportContainer: {
    marginTop: 40,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  supportEmail: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default PaymentResultScreen;

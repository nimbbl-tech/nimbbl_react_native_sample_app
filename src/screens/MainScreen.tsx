import React, { useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderData } from '../types';
import { globalStyles } from '../styles/globalStyles';
import { ProductCard } from '../components/ProductCard';
import { ProductDetails } from '../components/ProductDetails';
import { UserDetailsForm } from '../components/UserDetailsForm';
import { PayButton } from '../components/PayButton';
import { Header } from '../components/Header';
import { Dropdown } from '../components/Dropdown';
import { Strings, Arrays } from '../constants/strings';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import { useDropdownRelationships } from '../hooks/useDropdownRelationships';
import { usePayment } from '../hooks/usePayment';

interface MainScreenProps {
  orderData: OrderData;
  onOrderDataChange: (data: Partial<OrderData>) => void;
  onSettingsPress: () => void;
  onPayPress: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({
  orderData,
  onOrderDataChange,
  onSettingsPress,
  onPayPress,
}) => {
  const { paymentData, updatePaymentType, updateSubPaymentType } = useDropdownRelationships();
  const { isPaymentLoading, handlePayment, cleanup } = usePayment(onPayPress);

  // Memoized callback functions for better performance
  const handleAmountChange = useCallback((amount: string) => {
    onOrderDataChange({ amount });
  }, [onOrderDataChange]);

  const handleCurrencyChange = useCallback((currency: string) => {
    onOrderDataChange({ currency });
  }, [onOrderDataChange]);

  const handlePaymentTypeChange = useCallback((value: string) => {
    updatePaymentType(value);
  }, [updatePaymentType]);

  const handleSubPaymentTypeChange = useCallback((value: string) => {
    updateSubPaymentType(value);
  }, [updateSubPaymentType]);

  const handleOrderLineItemsChange = useCallback((value: boolean) => {
    onOrderDataChange({ orderLineItems: value });
    
    // Reset header customisation to first option when order line items changes
    const newOptions = value ? Arrays.optionEnabled : Arrays.optionDisabled;
    onOrderDataChange({ headerCustomisation: newOptions[0] });
  }, [onOrderDataChange]);

  const handleHeaderCustomisationChange = useCallback((value: string) => {
    onOrderDataChange({ headerCustomisation: value });
  }, [onOrderDataChange]);

  const handleUserDetailsToggle = useCallback(() => {
    onOrderDataChange({ userDetails: !orderData.userDetails });
  }, [orderData.userDetails, onOrderDataChange]);

  const handlePaymentPress = useCallback(() => {
    handlePayment(orderData);
  }, [handlePayment, orderData]);

  // Get header customisation options based on order line items toggle
  const getHeaderCustomisationOptions = useCallback(() => {
    return orderData.orderLineItems ? Arrays.optionEnabled : Arrays.optionDisabled;
  }, [orderData.orderLineItems]);

  // Check if subpayment dropdown should be visible
  const shouldShowSubPayment = useCallback(() => {
    return paymentData.paymentType !== 'all payments modes' && paymentData.paymentType !== 'card';
  }, [paymentData.paymentType]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <View style={globalStyles.container}>
      <Header onSettingsPress={onSettingsPress} />

      <ScrollView style={globalStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={globalStyles.content}>
          <ProductCard />
          
          <ProductDetails 
            orderData={orderData} 
            onAmountChange={handleAmountChange}
            onCurrencyChange={handleCurrencyChange}
          />

          {/* Transaction Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>i</Text>
              </View>
              <Text style={styles.infoText}>{Strings.transactionInfo}</Text>
            </View>
          </View>

          {/* Order Line Items Toggle */}
          <View style={globalStyles.toggleContainer}>
            <Text style={globalStyles.toggleLabel}>{Strings.orderLineItems}</Text>
            <Switch
              value={orderData.orderLineItems}
              onValueChange={handleOrderLineItemsChange}
              trackColor={{false: Colors.switchTrackColorUnchecked, true: Colors.switchTrackColor}}
              thumbColor={Colors.switchThumbColor}
              ios_backgroundColor={Colors.switchTrackColorUnchecked}
            />
          </View>

          {/* Header Customisation Dropdown */}
          <Dropdown
            label={Strings.headerCustomisation}
            value={orderData.headerCustomisation}
            options={getHeaderCustomisationOptions()}
            onValueChange={handleHeaderCustomisationChange}
          />

          {/* Payment Customisation Dropdown */}
          <Dropdown
            label={Strings.paymentCustomisation}
            value={paymentData.paymentType}
            options={Arrays.paymentType}
            onValueChange={handlePaymentTypeChange}
          />

          {/* Sub Payment Customisation Dropdown - Only show for specific payment types */}
          {shouldShowSubPayment() && (
            <Dropdown
              label={Strings.subpaymentMode}
              value={paymentData.subPaymentType}
              options={paymentData.availableSubPaymentOptions}
              onValueChange={handleSubPaymentTypeChange}
            />
          )}

          {/* User Details Checkbox */}
          <View style={globalStyles.toggleContainer}>
            <Text style={globalStyles.toggleLabel}>{Strings.userDetails}</Text>
            <TouchableOpacity
              style={[styles.checkbox, orderData.userDetails && styles.checkboxChecked]}
              onPress={handleUserDetailsToggle}>
              {orderData.userDetails && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          </View>

          <UserDetailsForm 
            orderData={orderData} 
            onOrderDataChange={onOrderDataChange} 
          />

          <PayButton isLoading={isPaymentLoading} onPress={handlePaymentPress} />

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Bottom Header with Safe Area */}
      <SafeAreaView edges={['bottom']} style={globalStyles.bottomHeader}>
        <Text style={globalStyles.bottomHeaderText}>{Strings.copyrightText}</Text>
      </SafeAreaView>
    </View>
  );
};

const styles = {
  infoContainer: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  infoIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.black,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  infoIconText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: Fonts.gorditaBold,
    lineHeight: 10,
    textAlign: 'center' as const,
  },
  infoText: {
    fontSize: 10,
    color: Colors.lightGrey,
    fontStyle: 'italic' as const,
    fontFamily: Fonts.gorditaRegularItalic,
    marginLeft: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 3,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.white,
  },
  checkboxChecked: {
    backgroundColor: Colors.black,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  bottomSpacer: {
    height: 30,
  },
};

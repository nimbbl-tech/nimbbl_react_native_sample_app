import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { OrderData, SettingsData } from '../types';
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
import { useOrderData } from '../hooks/useOrderData';
import { useSettings } from '../contexts/SettingsContext';
import { paymentService } from '../services/PaymentService';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface MainScreenProps {
  navigation: MainScreenNavigationProp;
}

export const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const { orderData, updateOrderData } = useOrderData();
  const { settingsData, updateSettingsData } = useSettings();
  const { paymentData, updatePaymentType, updateSubPaymentType } = useDropdownRelationships(
    orderData.paymentCustomisation,
    orderData.subPaymentCustomisation
  );
  
  

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handlePayPress = () => {
    // This will be handled by the payment service callbacks
  };

               const handleCheckoutResponse = (data: any) => {
                 // Send raw data to PaymentResult screen for parsing
                 navigation.navigate('PaymentResult', { paymentData: data });
               };

  const { isPaymentLoading, handlePayment } = usePayment(handlePayPress, handleCheckoutResponse);

  // Memoized callback functions for better performance
  const handleAmountChange = useCallback((amount: string) => {
    updateOrderData({ amount });
  }, [updateOrderData]);

  const handleCurrencyChange = useCallback((currency: string) => {
    updateOrderData({ currency });
  }, [updateOrderData]);

  const handlePaymentTypeChange = useCallback((value: string) => {
    updatePaymentType(value);
    // Also update the main order data to keep it in sync
    updateOrderData({ paymentCustomisation: value });
  }, [updatePaymentType, updateOrderData]);

  const handleSubPaymentTypeChange = useCallback((value: string) => {
    updateSubPaymentType(value);
    // Also update the main order data to keep it in sync
    updateOrderData({ subPaymentCustomisation: value });
  }, [updateSubPaymentType, updateOrderData]);

  const handleOrderLineItemsChange = useCallback((value: boolean) => {
    updateOrderData({ orderLineItems: value });
    
    // Reset header customisation to first option when order line items changes
    const newOptions = value ? Arrays.optionEnabled : Arrays.optionDisabled;
    updateOrderData({ headerCustomisation: newOptions[0] });
  }, [updateOrderData]);

  const handleHeaderCustomisationChange = useCallback((value: string) => {
    updateOrderData({ headerCustomisation: value });
  }, [updateOrderData]);

  const handleUserDetailsToggle = useCallback(() => {
    updateOrderData({ userDetails: !orderData.userDetails });
  }, [orderData.userDetails, updateOrderData]);

  const handlePaymentPress = useCallback(() => {
    handlePayment(orderData, settingsData);
  }, [handlePayment, orderData, settingsData]);

  const handleSettingsDone = useCallback(async (newSettingsData: SettingsData) => {
    try {
      // Initialize SDK with the selected environment settings
      await paymentService.initialize(newSettingsData);
      updateSettingsData(newSettingsData);
    } catch (error) {
      console.error('❌ MainScreen: Failed to initialize SDK with settings:', error);
    }
    navigation.goBack();
  }, [updateSettingsData, navigation]);

  // Get header customisation options based on order line items toggle
  const getHeaderCustomisationOptions = useCallback(() => {
    return orderData.orderLineItems ? Arrays.optionEnabled : Arrays.optionDisabled;
  }, [orderData.orderLineItems]);

  // Check if subpayment dropdown should be visible
  const shouldShowSubPayment = useCallback(() => {
    return orderData.paymentCustomisation !== 'all payments modes' && orderData.paymentCustomisation !== 'card';
  }, [orderData.paymentCustomisation]);


  // Re-initialize SDK when settings change
  useEffect(() => {
    const reinitializeSDK = async () => {
      if (settingsData) {
        try {
          await paymentService.initialize(settingsData);
        } catch (error) {
          console.error('❌ MainScreen: Failed to re-initialize SDK:', error);
        }
      }
    };
    
    reinitializeSDK();
  }, [settingsData.environment, settingsData.qaUrl, settingsData.preProdUrl, settingsData.prodUrl]);

  // Clean up on unmount


  return (
    <SafeAreaView style={globalStyles.container} edges={['top', 'left', 'right']}>
      <Header onSettingsPress={handleSettingsPress} />

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
            value={orderData.paymentCustomisation}
            options={Arrays.paymentType}
            onValueChange={handlePaymentTypeChange}
          />

          {/* Sub Payment Customisation Dropdown - Only show for specific payment types */}
          {shouldShowSubPayment() && (
            <Dropdown
              label={Strings.subpaymentMode}
              value={orderData.subPaymentCustomisation}
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
            onOrderDataChange={updateOrderData} 
          />

                 <PayButton isLoading={isPaymentLoading} onPress={handlePaymentPress} />

                 <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Bottom Header with Safe Area */}
      <SafeAreaView edges={['bottom']} style={globalStyles.bottomHeader}>
        <Text style={globalStyles.bottomHeaderText}>{Strings.copyrightText}</Text>
      </SafeAreaView>
    </SafeAreaView>
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

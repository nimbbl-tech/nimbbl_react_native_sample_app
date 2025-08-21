import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { OrderData } from '../types';
import { Strings, Arrays } from '../constants/strings';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/colors';
import { Dropdown } from './Dropdown';

interface ProductDetailsProps {
  orderData: OrderData;
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  orderData, 
  onAmountChange,
  onCurrencyChange
}) => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  return (
    <View style={styles.productDetails}>
      <Text style={styles.productTitle}>{Strings.paperPlane}</Text>
      <View style={styles.priceContainer}>
        {/* Currency Dropdown - Directly on left of amount */}
        <View style={styles.currencyContainer}>
          <Dropdown
            label=""
            value={orderData.currency}
            options={Arrays.appCurrencyFormat}
            onValueChange={(value) => {
              onCurrencyChange(value);
            }}
          />
        </View>
        
        {/* Amount Input - Fixed Position */}
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            value={orderData.amount}
            onChangeText={onAmountChange}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    fontFamily: Fonts.gorditaBold,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  currencyContainer: {
    marginRight: 5,
    zIndex: 1,
    height: 40, // Match amount input height
    justifyContent: 'center',
  },
  amountContainer: {
    position: 'relative',
    zIndex: 0,
    height: 40, // Match currency container height
    justifyContent: 'center',
  },
  amountInput: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.black,
    borderStyle: 'dashed',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Fonts.gorditaRegular,
    borderRadius: 8,
    paddingVertical: 0, // Remove vertical padding to ensure proper alignment
  },
});

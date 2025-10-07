import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Strings } from '../constants/strings';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

interface PayButtonProps {
  isLoading: boolean;
  onPress: () => void;
}

export const PayButton: React.FC<PayButtonProps> = ({ isLoading, onPress }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.payButton, isLoading && styles.payButtonDisabled]}
        onPress={onPress}
        disabled={isLoading}>
        <Text style={styles.payButtonText}>
          {Strings.payNow}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 15,
  },
  payButton: {
    height: 48,
    backgroundColor: Colors.black,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: Colors.grey,
  },
  payButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Fonts.gorditaBold,
  },
});

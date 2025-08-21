import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { OrderData } from '../types';
import { globalStyles } from '../styles/globalStyles';
import { Strings } from '../constants/strings';

interface UserDetailsFormProps {
  orderData: OrderData;
  onOrderDataChange: (data: Partial<OrderData>) => void;
}

export const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ 
  orderData, 
  onOrderDataChange 
}) => {
  if (!orderData.userDetails) return null;

  return (
    <View style={styles.userDetailsContainer}>
      <TextInput
        style={globalStyles.inputField}
        placeholder={Strings.nameHint}
        value={orderData.firstName}
        onChangeText={(text) => onOrderDataChange({ firstName: text })}
      />
      <TextInput
        style={globalStyles.inputField}
        placeholder={Strings.numberHint}
        value={orderData.mobileNumber}
        onChangeText={(text) => onOrderDataChange({ mobileNumber: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={globalStyles.inputField}
        placeholder={Strings.emailHint}
        value={orderData.email}
        onChangeText={(text) => onOrderDataChange({ email: text })}
        keyboardType="email-address"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  userDetailsContainer: {
    marginBottom: 15,
  },
});

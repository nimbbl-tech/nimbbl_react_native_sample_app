import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/globalStyles';
import { ScreenHeader } from '../components/ScreenHeader';
import { Strings } from '../constants/strings';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

interface SuccessScreenProps {
  orderId?: string;
  orderStatus?: string;
  onBackPress: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  orderId = 'N/A',
  orderStatus = 'Success',
  onBackPress,
}) => {
  return (
    <View style={globalStyles.container}>
      <ScreenHeader title={Strings.orderSuccessTitle} onBackPress={onBackPress} />

      {/* Success Content */}
      <View style={styles.successContent}>
        <Text style={styles.successStatus}>{orderStatus}</Text>
        <Text style={styles.successOrderId}>{orderId}</Text>
      </View>

      {/* Bottom Safe Area */}
      <SafeAreaView edges={['bottom']} />
    </View>
  );
};

const styles = StyleSheet.create({
  successContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
  },
  successStatus: {
    fontSize: 20,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: Fonts.gorditaBold,
  },
  successOrderId: {
    fontSize: 20,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: Fonts.gorditaRegular,
  },
});

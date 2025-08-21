import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { BackButton } from './BackButton';

interface ScreenHeaderProps {
  title: string;
  onBackPress: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBackPress }) => {
  return (
    <View style={globalStyles.settingsHeader}>
      <BackButton onPress={onBackPress} />
      <Text style={globalStyles.settingsHeaderTitle}>{title}</Text>
    </View>
  );
};

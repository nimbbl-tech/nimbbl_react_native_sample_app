import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

interface BackButtonProps {
  onPress: () => void;
  accessibilityLabel?: string;
  style?: any;
  variant?: 'arrow' | 'chevron' | 'caret';
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  onPress, 
  accessibilityLabel = 'Go back',
  style,
  variant = 'arrow'
}) => {
  const getBackIcon = () => {
    switch (variant) {
      case 'chevron':
        return '‹'; // Chevron left
      case 'caret':
        return '‹'; // Caret left
      case 'arrow':
      default:
        return '‹'; // Arrow left (larger, more visible)
    }
  };

  return (
    <TouchableOpacity
      style={[styles.backButton, style]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={0.7}>
      <Text style={styles.backIcon}>{getBackIcon()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 40, // Reduced size to minimize padding around icon
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Circular touch area
    // Add subtle shadow for better visual hierarchy
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: Platform.OS === 'android' ? 2 : 0, // Android shadow
  },
  backIcon: {
    color: Colors.white,
    fontSize: Platform.OS === 'ios' ? 32 : 34, // Adjusted size for compact container
    fontWeight: 'bold',
    fontFamily: Fonts.gorditaBold,
    lineHeight: Platform.OS === 'ios' ? 32 : 34,
    // Ensure proper alignment
    textAlign: 'center',
    textAlignVertical: 'center',
    // Add platform-specific adjustments
    ...Platform.select({
      ios: {
        marginTop: 1, // Fine-tune vertical alignment on iOS
      },
      android: {
        marginTop: 0,
      },
    }),
  },
});

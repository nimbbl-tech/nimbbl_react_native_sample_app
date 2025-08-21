import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

interface DropdownProps {
  label: string;
  value: string;
  options: readonly string[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onValueChange,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <View style={[styles.container, !label && styles.containerNoLabel]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={[styles.dropdownButton, disabled && styles.disabled]}
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}>
        <Text style={styles.dropdownButtonText}>{value}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity 
                style={styles.closeButtonContainer}
                onPress={handleClose}
                accessibilityLabel="Close dropdown"
                accessibilityRole="button">
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item === value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item)}>
                  <Text
                    style={[
                      styles.optionText,
                      item === value && styles.selectedOptionText,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  containerNoLabel: {
    marginBottom: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 8,
    fontFamily: Fonts.gorditaMedium,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    backgroundColor: Colors.lightGreyBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.gorditaRegular,
  },
  dropdownArrow: {
    fontSize: 12,
    color: Colors.grey,
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: width * 0.8,
    maxHeight: height * 0.6,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGrey,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    fontFamily: Fonts.gorditaBold,
    flex: 1, // Ensure title takes available space
  },
  closeButtonContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  closeButton: {
    fontSize: 18, // Reduced size for better proportion
    color: Colors.grey,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
  },
  optionsList: {
    maxHeight: height * 0.4,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGrey,
  },
  selectedOption: {
    backgroundColor: Colors.lightGreyBg,
  },
  optionText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.gorditaRegular,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: Colors.black,
    fontFamily: Fonts.gorditaBold,
  },
});

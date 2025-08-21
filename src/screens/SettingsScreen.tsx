import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsData } from '../types';
import { globalStyles } from '../styles/globalStyles';
import { ScreenHeader } from '../components/ScreenHeader';
import { Dropdown } from '../components/Dropdown';
import { Strings, Arrays } from '../constants/strings';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

interface SettingsScreenProps {
  settingsData: SettingsData;
  onSettingsDataChange: (data: Partial<SettingsData>) => void;
  onBackPress: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settingsData,
  onSettingsDataChange,
  onBackPress,
}) => {
  return (
    <View style={globalStyles.container}>
      <ScreenHeader title={Strings.settingsTitle} onBackPress={onBackPress} />

      <ScrollView style={globalStyles.scrollView}>
        <View style={styles.settingsContent}>
          {/* Environment Section */}
          <Dropdown
            label={Strings.selectEnvironment}
            value={settingsData.environment}
            options={Arrays.appEnvironments}
            onValueChange={(value) => onSettingsDataChange({ environment: value })}
          />

          {/* QA URL Input */}
          {settingsData.environment === 'QA' && (
            <View style={styles.qaUrlContainer}>
              <Text style={styles.qaUrlLabel}>{Strings.qaUrlHint}</Text>
              <TextInput
                style={styles.qaUrlInput}
                placeholder={Strings.qaUrlHint}
                value={settingsData.qaUrl}
                onChangeText={(text) => onSettingsDataChange({ qaUrl: text })}
              />
            </View>
          )}

          {/* Experience Section */}
          <Dropdown
            label={Strings.selectExperience}
            value={settingsData.experience}
            options={Arrays.appExperienceMode}
            onValueChange={(value) => onSettingsDataChange({ experience: value })}
          />

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={onBackPress}>
            <Text style={styles.doneButtonText}>{Strings.lblDone}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Safe Area */}
      <SafeAreaView edges={['bottom']} />
    </View>
  );
};

const styles = StyleSheet.create({
  settingsContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  qaUrlContainer: {
    marginBottom: 20,
  },
  qaUrlLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
    fontFamily: Fonts.gorditaBold,
  },
  qaUrlInput: {
    height: 44,
    backgroundColor: Colors.lightGreyBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: Fonts.gorditaRegular,
  },
  doneButton: {
    height: 48,
    backgroundColor: Colors.black,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Fonts.gorditaBold,
  },
});

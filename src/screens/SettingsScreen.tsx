import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SettingsData } from '../types';
import { globalStyles } from '../styles/globalStyles';
import { ScreenHeader } from '../components/ScreenHeader';
import { Dropdown } from '../components/Dropdown';
import { Strings, Arrays } from '../constants/strings';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import { useSettings } from '../contexts/SettingsContext';
import { API_URLS } from '../constants/apiUrls';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { settingsData, updateSettingsData } = useSettings();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDonePress = () => {
    // Settings are already saved via updateSettingsData calls
    navigation.goBack();
  };
  return (
    <SafeAreaView style={globalStyles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader title={Strings.settingsTitle} onBackPress={handleBackPress} />

      <ScrollView style={globalStyles.scrollView}>
        <View style={styles.settingsContent}>
          {/* Environment Section */}
          <Dropdown
            label={Strings.selectEnvironment}
            value={settingsData.environment}
            options={Arrays.appEnvironments}
            onValueChange={(value) => updateSettingsData({ environment: value })}
          />

          {/* QA URL Input */}
          {settingsData.environment === 'QA' && (
            <View style={styles.qaUrlContainer}>
              <Text style={styles.qaUrlLabel}>{Strings.qaUrlHint}</Text>
              <TextInput
                style={styles.qaUrlInput}
                placeholder={API_URLS.QA}
                value={settingsData.qaUrl}
                onChangeText={(text) => updateSettingsData({ qaUrl: text })}
              />
            </View>
          )}

          {/* Experience Section */}
          <Dropdown
            label={Strings.selectExperience}
            value={settingsData.experience}
            options={Arrays.appExperienceMode}
            onValueChange={(value) => updateSettingsData({ experience: value })}
          />

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDonePress}>
            <Text style={styles.doneButtonText}>{Strings.lblDone}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Safe Area */}
      <SafeAreaView edges={['bottom']} />
    </SafeAreaView>
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

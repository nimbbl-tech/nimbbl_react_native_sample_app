import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Images } from '../constants/images';
import { Strings } from '../constants/strings';
import { Colors } from '../constants/colors';

interface HeaderProps {
	onSettingsPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsPress }) => {
	return (
		<View style={globalStyles.header}>
			<View style={globalStyles.headerLeft}>
				<Image 
					source={Images.sonic} 
					style={{ width: 40, height: 40, marginRight: 8 }}
					resizeMode="contain"
				/>
				<Text style={globalStyles.headerText}>{Strings.byNimbbl}</Text>
			</View>
			<TouchableOpacity
				style={globalStyles.settingsButton}
				onPress={onSettingsPress}>
				<Text style={globalStyles.settingsIcon}>⚙</Text>
			</TouchableOpacity>
		</View>
	);
};

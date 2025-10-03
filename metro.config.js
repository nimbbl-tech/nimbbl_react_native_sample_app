const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      'nimbbl-mobile-react-native-sdk': path.resolve(__dirname, '../nimbbl_mobile_kit_react_native_sdk'),
    },
  },
  watchFolders: [
    path.resolve(__dirname, '../nimbbl_mobile_kit_react_native_sdk'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

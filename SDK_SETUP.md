# SDK Setup Guide - Local vs NPM

This guide explains how to switch between local development and published npm versions of the Nimbbl React Native SDK.

## Quick Toggle Commands

### Switch to Local Development (SDK Development)
```bash
npm run link:local
```

This will:
- Copy `package.local.json` to `package.json`
- Install the local SDK from `../nimbbl_mobile_kit_react_native_sdk`
- Run `npm install` to update dependencies

### Switch to Published NPM Package (Production/Testing)
```bash
npm run link:npm
```

This will:
- Copy `package.npm.json` to `package.json`
- Install the published SDK from npm
- Run `npm install` to update dependencies

## File Structure

```
nimbbl_react_native_sample_app/
├── package.json              # Current active configuration
├── package.local.json        # Local development setup
├── package.npm.json          # NPM package setup
└── SDK_SETUP.md             # This guide
```

## Configuration Differences

### Local Development (`package.local.json`)
```json
{
  "dependencies": {
    "nimbbl-react-native-sdk": "file:../nimbbl_mobile_kit_react_native_sdk"
  }
}
```

### NPM Package (`package.npm.json`)
```json
{
  "dependencies": {
    "nimbbl-react-native-sdk": "^1.0.0-alpha"
  }
}
```

## When to Use Each Setup

### Use Local Development When:
- 🔧 Developing the SDK itself
- 🐛 Debugging SDK issues
- 🧪 Testing SDK changes
- 📝 Making modifications to the SDK

### Use NPM Package When:
- 🚀 Testing the published package
- 📱 Production app development
- 🔍 Verifying npm installation works
- 👥 Sharing with other developers

## Development Workflow

### For SDK Development:
1. Make changes to the SDK in `../nimbbl_mobile_kit_react_native_sdk`
2. Build the SDK: `cd ../nimbbl_mobile_kit_react_native_sdk && npm run build`
3. Switch to local: `npm run link:local`
4. Test changes in the sample app
5. Repeat as needed

### For Testing Published Package:
1. Publish SDK to npm (see `PUBLISHING.md`)
2. Switch to npm: `npm run link:npm`
3. Test the published package
4. Verify everything works correctly

## Troubleshooting

### If Local Setup Doesn't Work:
```bash
# Rebuild the SDK
cd ../nimbbl_mobile_kit_react_native_sdk
npm run clean
npm run build

# Switch back to local
cd ../nimbbl_react_native_sample_app
npm run link:local
```

### If NPM Setup Doesn't Work:
```bash
# Clear npm cache
npm cache clean --force

# Switch to npm
npm run link:npm

# Check if package is published
npm view nimbbl-react-native-sdk
```

### If iOS Build Fails:
```bash
# Clean and reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### If Android Build Fails:
```bash
# Clean gradle cache
cd android
./gradlew clean
cd ..
```

## Verification

### Check Current Setup:
```bash
# Check which version is installed
npm list nimbbl-react-native-sdk

# Should show either:
# - file:../nimbbl_mobile_kit_react_native_sdk (local)
# - nimbbl-react-native-sdk@1.0.0-alpha (npm)
```

### Test SDK Import:
```javascript
// This should work in both setups
import { NimbblSDK } from 'nimbbl-react-native-sdk';

const sdk = NimbblSDK.getSharedInstance();
console.log('SDK loaded successfully');
```

## Best Practices

1. **Always rebuild SDK** after making changes when using local setup
2. **Test both setups** before publishing new SDK versions
3. **Keep both package files** in sync with dependency updates
4. **Use npm setup** for final testing before release
5. **Document any breaking changes** when switching between versions

## Notes

- The `package.json` file is the active configuration
- `package.local.json` and `package.npm.json` are templates
- Switching between setups will trigger `npm install`
- iOS pods will be reinstalled automatically
- All other dependencies remain the same in both setups

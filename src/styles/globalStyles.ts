import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 16,
    paddingBottom: 16,
  },
  header: {
    height: 56,
    backgroundColor: Colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.white,
    fontSize: 12,
    marginLeft: 8,
    fontFamily: Fonts.gorditaRegular,
  },
  settingsButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
    color: Colors.white,
  },
  settingsHeader: {
    height: 56, // Adjusted height for compact back button
    backgroundColor: Colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },

  settingsHeaderTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
    fontFamily: Fonts.gorditaBold,
  },
  bottomHeader: {
    backgroundColor: Colors.black,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  bottomHeaderText: {
    color: Colors.lightGrey,
    fontSize: 11,
    fontFamily: Fonts.gorditaRegular,
  },
  dropdownButton: {
    height: 50,
    backgroundColor: Colors.lightGreyBg,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.gorditaRegular,
  },
  dropdownArrow: {
    fontSize: 12,
    color: Colors.grey,
  },
  inputField: {
    height: 50,
    backgroundColor: Colors.lightGreyBg,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.black,
    marginBottom: 15,
    fontFamily: Fonts.gorditaMedium,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.black,
    fontFamily: Fonts.gorditaMedium,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 8,
    fontFamily: Fonts.gorditaMedium,
  },
  // Button styles based on Android drawables
  buttonBackground: {
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  cornerShape: {
    backgroundColor: Colors.white,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  doneButtonBackground: {
    backgroundColor: Colors.black,
    borderRadius: 8,
  },
  editTextBackground: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
  },
});

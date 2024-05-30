import {Platform, StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {},

  coverContainer: {
    position: 'relative',
    width: '100%',
    height: Platform.OS === 'android' ? 175 : 220,
  },
  coverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  coverButtons: {
    position: 'relative',
  },

  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 99,
  },
  settingsButtonText: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  avatarContainer: {
    position: 'relative',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 50,
    transform: [{translateY: -50}],
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: 'white',
  },

  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
  },

  secondaryButton: {
    backgroundColor: 'rgba(12, 12, 79, 0.1)',
  },
  secondaryButtonText: {
    color: '#14142c',
  },
  iconButton: {
    backgroundColor: 'rgba(12, 12, 79, 0.1)',
    padding: 12,
  },
});

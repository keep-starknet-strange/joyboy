import {StyleSheet} from 'react-native';

export default StyleSheet.create({
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
  buttonIcon: {
    marginRight: 6,
  },

  info: {
    padding: 16,
  },

  displayName: {
    fontSize: 20,
    lineHeight: 24,
    color: '#14142c',
  },

  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    maxWidth: '50%',
    fontSize: 16,
    color: '#6B6B8C',
    marginRight: 16,
  },
  publicKey: {
    flex: 1,
    maxWidth: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  publicKeyText: {
    flex: 1,
    fontSize: 14,
    color: '#EC796B',
  },

  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B6B8C',
    marginBottom: 16,
  },

  connections: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectionsText: {
    fontSize: 14,
    color: '#14142C',
  },
});

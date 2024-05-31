import {Spacing, ThemedStyleSheet} from '../../../styles';

export default ThemedStyleSheet((theme) => ({
  secondaryButton: {
    backgroundColor: theme.colors.buttonDisabledBackground,
  },
  secondaryButtonText: {
    color: theme.colors.text,
  },
  iconButton: {
    backgroundColor: theme.colors.buttonDisabledBackground,
    padding: Spacing.small,
  },
  buttonIcon: {
    marginRight: Spacing.xxsmall,
  },

  info: {
    padding: Spacing.medium,
  },

  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xsmall,
  },
  username: {
    maxWidth: '50%',
    marginRight: Spacing.medium,
  },
  publicKey: {
    flex: 1,
    maxWidth: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  publicKeyText: {
    flex: 1,
    color: theme.colors.primary,
  },

  bio: {
    marginBottom: Spacing.medium,
  },

  connections: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xsmall,
  },
}));

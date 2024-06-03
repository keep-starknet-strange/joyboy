import {Platform} from 'react-native';

import {Spacing, ThemedStyleSheet} from '../../../styles';

const AVATAR_SIZE = 100;

export default ThemedStyleSheet((theme) => ({
  container: {},

  coverContainer: {
    position: 'relative',
    width: '100%',
    height: Platform.OS === 'ios' ? 220 : 175,
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
    top: Spacing.pagePadding,
    left: Spacing.pagePadding,
  },
  settingsButton: {
    position: 'absolute',
    top: Spacing.pagePadding,
    right: Spacing.pagePadding,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xsmall,
    paddingHorizontal: Spacing.small,
    backgroundColor: theme.colors.surface,
    borderRadius: 99,
  },
  settingsButtonText: {
    lineHeight: Spacing.medium,
    marginLeft: Spacing.xsmall,
  },

  avatarContainer: {
    position: 'relative',
    flexDirection: 'row',
    paddingHorizontal: Spacing.pagePadding,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE / 2,
    transform: [{translateY: (AVATAR_SIZE / 2) * -1}],
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE,
    borderWidth: 5,
    borderColor: 'white',
  },

  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.xsmall,
    paddingTop: Spacing.xsmall,
  },
}));

import {StyleSheet} from 'react-native';

import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  container: {},

  outsideContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  outside: {
    width: '100%',
    height: '100%',
  },

  menuContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  menu: {
    position: 'absolute',
    height: 'auto',
    gap: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },

  menuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxsmall,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    color: theme.colors.text,
  },
}));

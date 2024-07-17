import {Platform} from 'react-native';

import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    paddingVertical: Platform.select({
      android: Spacing.none,
      ios: Spacing.medium,
      web: Spacing.none,
    }),
    paddingHorizontal: Platform.select({
      android: Spacing.medium,
      ios: Spacing.large,
      web: Spacing.medium,
    }),
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 99,
  },

  web: {
    backgroundColor: theme.colors.transparent,
    borderWidth: 0,
    borderRadius: 0,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.xsmall,
    color: theme.colors.text,
  },
}));

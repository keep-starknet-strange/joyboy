import {Platform} from 'react-native';

import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    paddingVertical: Platform.OS === 'android' ? Spacing.none : Spacing.medium,
    paddingHorizontal: Platform.OS === 'android' ? Spacing.medium : Spacing.large,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 99,
  },
}));

import {Platform} from 'react-native';

import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  modal: {
    backgroundColor: theme.colors.surface,
  },

  header: {
    width: '100%',
    marginBottom: Spacing.medium,
  },
  title: {
    marginBottom: Spacing.xsmall,
  },

  content: {
    padding: Spacing.xlarge,
    paddingTop: Platform.OS === 'ios' ? Spacing.xlarge : Spacing.xsmall,
  },
}));

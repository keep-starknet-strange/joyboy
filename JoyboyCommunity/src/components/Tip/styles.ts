import {Platform} from 'react-native';

import {Spacing, ThemedStyleSheet, Theme} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  modal: {
    backgroundColor: theme.colors.surface,
    paddingLeft: Spacing.small,
    paddingRight: Spacing.small,
    paddingBottom: Spacing.medium,
  },

  header: {
    width: '100%',
    marginBottom: Spacing.medium,
    paddingTop: Spacing.small,
    paddingLeft: Spacing.small,
    paddingRight: Spacing.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    color: theme.colors.primary,
  },
  title: {
    marginBottom: Spacing.xsmall,
  },

  post: {
    width: '100%',
    height: 112,
    backgroundColor: '#EC796B1A',
    borderRadius: 16,
    justifyContent: 'center',
    paddingLeft: Spacing.small,
    paddingRight: Spacing.small,
  },

  pickerSelect: {
    fontSize: 16,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 80,
    color: theme.colors.inputPlaceholder,
    paddingRight: 30,
    paddingLeft: 30,

    fontWeight: 600,
  },

  content: {
    padding: Spacing.xlarge,
    paddingTop: Platform.OS === 'ios' ? Spacing.xlarge : Spacing.xsmall,
  },
}));

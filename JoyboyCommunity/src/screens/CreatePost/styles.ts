import {StyleSheet} from 'react-native';

import {Spacing, ThemedStyleSheet, Typography} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: Spacing.pagePadding,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.divider,
  },
  cancelButton: {
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.xsmall,
  },

  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  input: {
    flex: 1,
    padding: Spacing.large,
    color: theme.colors.inputText,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
    ...Typography.medium,
  },

  buttons: {
    position: 'relative',
  },
  mediaButtons: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.small,
    gap: Spacing.large,
    alignItems: 'center',
  },
  sendButton: {
    position: 'absolute',
    right: Spacing.pagePadding,
    bottom: '110%',
  },
}));

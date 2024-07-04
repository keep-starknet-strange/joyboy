import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme, type: 'success' | 'info' | 'error') => ({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xsmall,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    borderRadius: 8,

    ...(type === 'success' && {
      backgroundColor: theme.colors.successLight,
    }),

    ...(type === 'info' && {
      backgroundColor: theme.colors.infoLight,
    }),

    ...(type === 'error' && {
      backgroundColor: theme.colors.errorLight,
    }),
  },

  text: {
    flex: 1,
  },

  closeIcon: {
    backgroundColor: theme.colors.transparent,
    padding: Spacing.none,
  },
}));

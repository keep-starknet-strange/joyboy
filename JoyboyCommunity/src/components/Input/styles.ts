import {Spacing, ThemedStyleSheet, Typography} from '../../styles';

export default ThemedStyleSheet((theme, error: boolean, left: boolean, right: boolean) => ({
  container: {
    width: '100%',
  },
  content: {
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.inputBorder,
    height: 56,

    ...(error && {
      backgroundColor: theme.colors.errorLight,
      borderColor: theme.colors.errorDark,
    }),

    ...(left && {
      paddingLeft: Spacing.small,
    }),

    ...(right && {
      paddingRight: Spacing.small,
    }),
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: Spacing.large,
    color: theme.colors.inputText,
    fontSize: 15,
    ...Typography.semiBold,

    ...(left && {
      paddingLeft: Spacing.none,
    }),

    ...(right && {
      paddingRight: Spacing.none,
    }),
  },

  errorText: {
    marginTop: 3,
    color: theme.colors.errorDark,
  },
}));

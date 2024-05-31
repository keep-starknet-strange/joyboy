import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme, disabled: boolean) => ({
  container: {
    padding: Spacing.xsmall,
    backgroundColor: theme.colors.surface,
    borderRadius: 99,

    ...(disabled && {
      backgroundColor: theme.colors.buttonDisabledBackground,
    }),
  },
}));

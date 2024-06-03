import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme, disabled: boolean, backgroundColor: string) => ({
  container: {
    padding: Spacing.xsmall,
    backgroundColor,
    borderRadius: 99,

    ...(disabled && {
      backgroundColor: theme.colors.buttonDisabledBackground,
    }),
  },
}));

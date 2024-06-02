import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet(
  (
    theme,
    variant: 'default' | 'primary' | 'secondary',
    block: boolean,
    disabled: boolean,
    small: boolean,
  ) => ({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.buttonBackground,
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.xlarge,
      borderRadius: 999,

      ...(block && {
        width: '100%',
      }),

      ...(small && {
        paddingVertical: Spacing.small,
        paddingHorizontal: Spacing.large,
      }),

      ...(variant === 'primary' && {
        backgroundColor: theme.colors.primary,
      }),

      ...(variant === 'secondary' && {
        backgroundColor: theme.colors.secondary,
      }),

      ...(disabled && {
        backgroundColor: theme.colors.buttonDisabledBackground,
      }),
    },

    text: {
      color: theme.colors.buttonText,
      fontSize: 15,
      textAlign: 'center',

      ...(small && {
        fontSize: 14,
      }),

      ...(variant === 'primary' && {
        color: theme.colors.onPrimary,
      }),

      ...(variant === 'secondary' && {
        color: theme.colors.onSecondary,
      }),

      ...(disabled && {
        color: theme.colors.buttonDisabledText,
      }),
    },
  }),
);

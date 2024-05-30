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

      ...(disabled && {
        backgroundColor: theme.colors.buttonDisabledBackground,
      }),

      ...(variant === 'primary' && {
        backgroundColor: theme.colors.primary,
      }),

      ...(variant === 'secondary' && {
        backgroundColor: theme.colors.secondary,
      }),
    },

    text: {
      color: theme.colors.buttonText,
      fontSize: 15,
      textAlign: 'center',

      ...(small && {
        fontSize: 14,
      }),

      ...(disabled && {
        color: theme.colors.buttonDisabledText,
      }),

      ...(variant === 'primary' && {
        color: theme.colors.onPrimary,
      }),

      ...(variant === 'secondary' && {
        color: theme.colors.onSecondary,
      }),
    },
  }),
);

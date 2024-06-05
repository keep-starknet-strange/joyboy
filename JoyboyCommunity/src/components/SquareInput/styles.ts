import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme, left: boolean, right: boolean, multiline: boolean) => ({
  container: {
    width: '100%',
  },
  content: {
    borderRadius: 8,
    height: 48,

    ...(multiline && {
      height: 110,
    }),

    ...(left && {
      paddingLeft: Spacing.small,
    }),

    ...(right && {
      paddingRight: Spacing.small,
    }),
  },

  input: {
    paddingHorizontal: Spacing.small,

    ...(multiline && {
      paddingVertical: Spacing.small,
      textAlignVertical: 'top',
    }),

    ...(left && {
      paddingLeft: Spacing.none,
    }),

    ...(right && {
      paddingRight: Spacing.none,
    }),
  },
}));

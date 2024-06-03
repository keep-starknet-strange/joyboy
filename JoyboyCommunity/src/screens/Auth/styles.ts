import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  inputWithLabel: {
    width: '100%',
  },
  warning: {
    display: 'flex',
    gap: Spacing.xsmall,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.small,
    borderRadius: 99,
  },
}));

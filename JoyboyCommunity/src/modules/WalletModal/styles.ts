import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  connectors: {
    marginVertical: Spacing.medium,
    gap: Spacing.small,
  },
  connector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: Spacing.small,
    borderRadius: 8,
    gap: Spacing.medium,
  },
}));

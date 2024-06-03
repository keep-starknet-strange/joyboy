import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    padding: Spacing.xsmall,
    marginHorizontal: Spacing.medium,
    marginBottom: Spacing.large,
    borderRadius: 16,
  },
}));

import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  modal: {
    padding: Spacing.large,
  },

  content: {
    alignItems: 'center',
  },
  icon: {
    marginTop: Spacing.xsmall,
    marginBottom: Spacing.large,
  },
  title: {
    marginBottom: Spacing.medium,
  },

  buttons: {
    gap: Spacing.xsmall,
    marginTop: Spacing.xlarge,
  },
}));

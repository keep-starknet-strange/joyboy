import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xlarge,
  },
  modal: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    padding: Spacing.large,
    borderRadius: 24,
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

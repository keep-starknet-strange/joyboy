import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
    paddingHorizontal: Spacing.xlarge,
  },

  modal: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    padding: Spacing.large,
    borderRadius: 24,
  },
}));

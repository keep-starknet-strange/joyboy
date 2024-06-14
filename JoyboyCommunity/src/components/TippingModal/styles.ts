import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '80%',
    height: 291,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
  },
  logo: {
    position: 'absolute',
    top: '-43%',
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: 16,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tipUser: {
    color: theme.colors.text,
  },
  tipAmount: {
    color: theme.colors.primary,
  },
  tipText: {
    color: theme.colors.textSecondary,
  },
  button: {
    width: '100%',
  },
}));

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
    width: 329,
    height: 291,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
  },
  icon: {
    position: 'absolute',
    top: -96,
    left: 42,
    width: 238,
    height: 208,
  },
  content: {
    top: 105,
    left: 24,
    gap: 16,
    width: 281,
    height: 162,
    alignItems: 'center',
    justifyContent: 'flex-start',
    justifyItems: 'flex-end',
  },
  button: {
    width: 281,
    height: 54,
    backgroundColor: '#0C0C4F',
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
}));

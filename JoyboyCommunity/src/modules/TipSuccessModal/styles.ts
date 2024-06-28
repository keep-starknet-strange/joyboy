import {Spacing, ThemedStyleSheet} from '../../styles';

export const LOGO_SIZE = 250;

export default ThemedStyleSheet((theme) => ({
  logoContainer: {
    width: '100%',
    height: LOGO_SIZE / 3,
  },
  logo: {
    position: 'absolute',
    top: -(LOGO_SIZE / 2),
    left: '50%',
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  logoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    left: '-50%',
  },
  content: {
    gap: Spacing.small,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: Spacing.medium,
  },
}));

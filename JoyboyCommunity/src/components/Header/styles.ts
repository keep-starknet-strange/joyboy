import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xxsmall,
    paddingHorizontal: Spacing.medium,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: Spacing.xsmall,
  },

  title: {
    flex: 1,
  },

  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

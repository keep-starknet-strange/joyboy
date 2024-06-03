import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme, asComment: boolean) => ({
  container: {},

  repost: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xxsmall,
  },

  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  infoUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
  },
  infoUserAvatar: {
    width: asComment ? 40 : 50,
    height: asComment ? 40 : 50,
  },
  infoDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
  },
  infoDetailsDivider: {
    width: 3,
    height: 3,
    borderRadius: 3,
    backgroundColor: theme.colors.textLight,
  },
  infoLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: Spacing.xxxsmall,
  },

  content: {
    marginBottom: Spacing.medium,
  },
  contentImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginTop: Spacing.small,
  },

  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerComments: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxsmall,
  },
}));

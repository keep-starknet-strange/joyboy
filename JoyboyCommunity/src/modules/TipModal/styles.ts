import {Platform} from 'react-native';

import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  modal: {
    paddingBottom: Spacing.xxlarge,
    background: theme.colors.background,
  },

  header: {
    width: '100%',
    marginBottom: Spacing.medium,
    paddingTop: Spacing.small,
    paddingLeft: Spacing.small,
    paddingBottom: Spacing.medium,
    paddingRight: Spacing.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    color: theme.colors.primary,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    paddingRight: Spacing.small,
  },

  title: {
    marginBottom: Spacing.xsmall,
  },

  cardContentText: {
    paddingTop: Spacing.small,
    paddingRight: Spacing.small,
    color: theme.colors.text,
  },
  likes: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },

  sending: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sendingText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xsmall,
  },

  recipient: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  card: {
    width: '100%',
    background: theme.colors.background,
    borderRadius: 16,
    padding: Spacing.medium,
  },

  comment: {
    paddingTop: Spacing.small,
  },

  pickerContainer: {
    flex: 1,
    gap: 20,
    paddingTop: Spacing.xxlarge,
    paddingBottom: Spacing.xxlarge,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  },

  more: {
    paddingLeft: Spacing.small,
    color: theme.colors.primary,
  },

  likeIcon: {
    color: theme.colors.primary,
  },

  content: {
    padding: Spacing.xlarge,
    paddingTop: Platform.OS === 'ios' ? Spacing.xlarge : Spacing.xsmall,
  },

  submitButton: {
    paddingTop: Spacing.xlarge,
  },
}));

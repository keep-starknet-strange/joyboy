import {Platform} from 'react-native';

import {Spacing, ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme) => ({
  modal: {
    backgroundColor: theme.colors.surface,
    paddingLeft: Spacing.medium,
    paddingRight: Spacing.medium,
    paddingBottom: Spacing.medium,
    height: 728,
  },

  header: {
    width: '100%',
    marginBottom: Spacing.medium,
    paddingTop: Spacing.small,
    paddingLeft: Spacing.small,
    paddingRight: Spacing.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    color: theme.colors.primary,
  },

  postHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},

  innerPostHeader: {flexDirection: 'row', gap: 5, alignItems: 'center'},
  title: {
    marginBottom: Spacing.xsmall,
  },
  likes: {flexDirection: 'row', gap: 3, alignItems: 'center'},

  recipient: {flexDirection: 'row', gap: 4, alignItems: 'center', paddingBottom: 10},
  post: {
    width: '100%',
    height: 112,
    backgroundColor: '#EC796B1A',
    borderRadius: 16,
    justifyContent: 'center',
    paddingLeft: Spacing.medium,
    paddingRight: Spacing.medium,
  },

  pickerSelect: {
    fontSize: 16,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 80,
    color: theme.colors.inputPlaceholder,
    paddingRight: 0,
    paddingLeft: 20,
    fontWeight: 600,
  },

  content: {
    padding: Spacing.xlarge,
    paddingTop: Platform.OS === 'ios' ? Spacing.xlarge : Spacing.xsmall,
  },
}));

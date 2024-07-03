import {StyleSheet} from 'react-native';

import {Spacing} from '../../styles';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  content: {
    paddingTop: Spacing.pagePadding,
    paddingHorizontal: Spacing.pagePadding,
    gap: Spacing.xsmall,
  },
});

import {StyleSheet} from 'react-native';

import {Spacing} from '../../styles';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.xlarge,
    borderRadius: 999,
  },
  block: {
    width: '100%',
  },
});

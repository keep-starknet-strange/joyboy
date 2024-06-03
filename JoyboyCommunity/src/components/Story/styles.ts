import {StyleSheet} from 'react-native';

import {Spacing} from '../../styles';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  imageContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
  },

  name: {
    paddingTop: Spacing.xxsmall,
  },
});

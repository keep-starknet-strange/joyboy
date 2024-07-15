import {Platform, useWindowDimensions as useRNWindowDimensions} from 'react-native';

import {WEB_MAX_WIDTH} from '../constants/misc';

export const useWindowDimensions = () => {
  const dimensions = useRNWindowDimensions();

  if (Platform.OS === 'web') dimensions.width = Math.min(dimensions.width, WEB_MAX_WIDTH);

  return dimensions;
};

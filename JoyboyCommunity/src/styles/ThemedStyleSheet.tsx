import memoizeOne from 'memoize-one';
import {StyleSheet} from 'react-native';

import {Theme} from '../styles/Colors';

/**
 * Custom StyleSheet creator that takes `theme` context. It passes the theme type automatically
 */
export const ThemedStyleSheet = <
  TStyle extends StyleSheet.NamedStyles<TStyle>,
  TArgs extends unknown[],
>(
  create: (theme: Theme, ...args: TArgs) => TStyle,
): ((theme: Theme, ...args: TArgs) => TStyle) => {
  return memoizeOne((theme, ...args: TArgs) => {
    return StyleSheet.create(create(theme, ...args));
  });
};

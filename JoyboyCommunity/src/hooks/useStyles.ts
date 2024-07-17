import {useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {Theme} from '../styles';
import {useTheme} from './useTheme';

export const useStyles = <TStyle extends StyleSheet.NamedStyles<TStyle>, TArgs extends unknown[]>(
  stylesheet: (theme: Theme, ...args: TArgs) => TStyle,
  ...args: TArgs
): TStyle => {
  const {theme} = useTheme();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => stylesheet(theme, ...args), [stylesheet, theme, ...args]);
};

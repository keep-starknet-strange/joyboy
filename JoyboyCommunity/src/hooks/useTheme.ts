import {useContext} from 'react';

import {IThemeContext, ThemeContext} from '../context/Theme';
import {Theme} from '../styles';

export const useTheme = (): IThemeContext => {
  return useContext(ThemeContext);
};

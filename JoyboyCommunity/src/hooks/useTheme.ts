import {useContext} from 'react';

import {ThemeContext} from '../context/Theme';
import {Theme} from '../styles';

export const useTheme = (): Theme => {
  return useContext(ThemeContext);
};

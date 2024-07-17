import {useContext} from 'react';

import {ThemeContext, ThemeContextType} from '../context/Theme';

export const useTheme = (): ThemeContextType => {
  return useContext(ThemeContext);
};

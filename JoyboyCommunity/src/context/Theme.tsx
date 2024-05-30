import {createContext, useMemo} from 'react';
import {useColorScheme} from 'react-native';

import {DarkTheme, LightTheme} from '../styles';

export const ThemeContext = createContext(LightTheme);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const defaultColorScheme = useColorScheme();

  const colorScheme = defaultColorScheme;

  const theme = useMemo(() => (colorScheme === 'dark' ? DarkTheme : LightTheme), [colorScheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

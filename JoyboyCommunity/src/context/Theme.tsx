import {createContext, useCallback, useMemo, useState} from 'react';
import {useColorScheme} from 'react-native';

import {DarkTheme, LightTheme, Theme} from '../styles';

export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: LightTheme,
  toggleTheme: () => {
    //
  },
});

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const defaultColorScheme = useColorScheme();

  const [schemeMode, setSchemeColor] = useState(defaultColorScheme || 'light');

  const theme = useMemo(() => (schemeMode === 'dark' ? DarkTheme : LightTheme), [schemeMode]);

  const toggleTheme = useCallback(() => {
    setSchemeColor((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return <ThemeContext.Provider value={{theme, toggleTheme}}>{children}</ThemeContext.Provider>;
};

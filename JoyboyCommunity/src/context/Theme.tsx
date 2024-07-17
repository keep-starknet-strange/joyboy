import {createContext, useMemo, useState} from 'react';
import {ColorSchemeName, useColorScheme} from 'react-native';

import {DarkTheme, LightTheme, Theme} from '../styles';

export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  // scheme: 'dark' | 'light';
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: LightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const defaultColorScheme = useColorScheme();

  const colorScheme = defaultColorScheme;
  const [schemeMode, setSchemeColor] = useState<'dark' | 'light'>('light');
  const theme = useMemo(() => (schemeMode === 'dark' ? DarkTheme : LightTheme), [schemeMode]);
  const toggleTheme = () => {
    setSchemeColor((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{theme, toggleTheme}}>{children}</ThemeContext.Provider>;
};

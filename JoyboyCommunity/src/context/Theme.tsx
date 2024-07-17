import {createContext, useMemo, useState} from 'react';
import {ColorSchemeName, useColorScheme} from 'react-native';

import {DarkTheme, LightTheme, Theme} from '../styles';

export type IThemeContext = {
  theme: Theme;
  toggleTheme: () => void;
  scheme: 'dark' | 'light';
};

export const ThemeContext = createContext<IThemeContext>({
  theme: LightTheme,
  toggleTheme: () => {},
  scheme: 'light',
});

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const defaultColorScheme = useColorScheme();

  const colorScheme = defaultColorScheme;
  const [scheme, setScheme] = useState<'dark' | 'light'>('light');
  const theme = useMemo(() => (scheme === 'dark' ? DarkTheme : LightTheme), [scheme]);
  const toggleTheme = () => {
    setScheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme, scheme}}>{children}</ThemeContext.Provider>
  );
};

export const CommonColors = {
  // black, white and center variants may be used for gradients or other purposes
  transparent: 'transparent',
  blackTransparent: 'rgba(0, 0, 0, 0)',
  whiteTransparent: 'rgba(255, 255, 255, 0)',
  centerTransparent: 'rgba(127, 127, 127, 0)',

  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
};

export const LightTheme = {
  dark: false,
  colors: {
    ...CommonColors,

    primary: '#EC796B',
    primaryLight: '#fef2f1',

    secondary: '#0C0C4F',
    secondaryLight: '#e7e7ed',

    background: '#F4F9FF',
    surface: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(13, 13, 29, 0.2)',

    text: '#14142C',
    textSecondary: '#6B6B8C',
    textLight: '#8F979E',
    textStrong: '#121212',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',

    divider: '#e4e4e7',

    bottomBarActive: '#14142C',
    bottomBarInactive: 'rgba(30, 47, 61, 0.5)',

    inputBackground: '#FCFCFF',
    inputText: '#14142C',
    inputBorder: '#DDDDEE',
    inputPlaceholder: '#A1A1C7',

    buttonBackground: '#e7e7ed',
    buttonText: '#7d7d8c',
    buttonDisabledBackground: 'rgba(12, 12, 79, 0.1)',
    buttonDisabledText: 'rgba(20, 20, 44, 0.5)',

    successLight: '#E4E9FA',
    successDark: '#6B87EC',
    errorLight: '#FFEDEB',
    errorDark: '#EC796B',
    infoLight: '#E6E6FC',
    infoDark: '#6B6B8C',
  },
};

export const DarkTheme = {
  dark: true,
  colors: {
    ...CommonColors,

    primary: '#EC796B',
    primaryLight: '#fef2f1',

    secondary: '#0C0C4F',
    secondaryLight: '#e7e7ed',

    background: '#F4F9FF',
    surface: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(13, 13, 29, 0.2)',

    text: '#14142C',
    textSecondary: '#6B6B8C',
    textLight: '#8F979E',
    textStrong: '#121212',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',

    divider: '#e4e4e7',

    bottomBarActive: '#14142C',
    bottomBarInactive: 'rgba(30, 47, 61, 0.5)',

    inputBackground: '#FCFCFF',
    inputText: '#14142C',
    inputBorder: '#DDDDEE',
    inputPlaceholder: '#A1A1C7',

    buttonBackground: '#e7e7ed',
    buttonText: '#7d7d8c',
    buttonDisabledBackground: 'rgba(12, 12, 79, 0.1)',
    buttonDisabledText: 'rgba(20, 20, 44, 0.5)',

    successLight: '#E4E9FA',
    successDark: '#6B87EC',
    errorLight: '#FFEDEB',
    errorDark: '#EC796B',
    infoLight: '#E6E6FC',
    infoDark: '#6B6B8C',
  },
};

export type Theme = typeof LightTheme;
export type ThemeColorNames = keyof Theme['colors'];

export type ColorProp = ThemeColorNames | 'transparent' | `#${string}` | `rgb${string}`;

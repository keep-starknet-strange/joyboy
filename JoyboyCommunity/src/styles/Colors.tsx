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

export const LightThemeColors = {
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

    text: '#14142C',
    textSecondary: '#6B6B8C',
    textLight: '#8F979E',
    textStrong: '#121212',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',

    bottomBarActive: '#14142C',
    bottomBarInactive: 'rgba(30, 47, 61, 0.5)',

    inputBackground: '#FCFCFF',
    inputText: '#14142C',
    inputBorder: '#DDDDEE',
    inputPlaceholder: '#A1A1C7',

    buttonBackground: '#e7e7ed',
    buttonText: '#7d7d8c',

    successLight: '#E4E9FA',
    successDark: '#6B87EC',
    errorLight: '#FFEDEB',
    errorDark: '#EC796B',
    infoLight: '#E6E6FC',
    infoDark: '#6B6B8C',
  },
};

export const DarkThemeColors = {
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

    text: '#14142C',
    textSecondary: '#6B6B8C',
    textLight: '#8F979E',
    textStrong: '#121212',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',

    bottomBarActive: '#14142C',
    bottomBarInactive: 'rgba(30, 47, 61, 0.5)',

    inputBackground: '#FCFCFF',
    inputText: '#14142C',
    inputBorder: '#DDDDEE',
    inputPlaceholder: '#A1A1C7',

    buttonBackground: '#e7e7ed',
    buttonText: '#7d7d8c',

    successLight: '#E4E9FA',
    successDark: '#6B87EC',
    errorLight: '#FFEDEB',
    errorDark: '#EC796B',
    infoLight: '#E6E6FC',
    infoDark: '#6B6B8C',
  },
};

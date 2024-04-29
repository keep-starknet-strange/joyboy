// Based mostly on https://github.com/Uniswap/interface/blob/main/src/theme/index.tsx

const colors = {
  white: '#FFFFFF',
  black: '#000000',

  neutral1_dark: '#ffffff',
  neutral2_dark: 'rgba(235, 235, 245, 0.45)',
}

const commonTheme = {
  white: colors.white,
  black: colors.black,

  accent1: '#5E5CE6',
}

export const darkTheme = {
  ...commonTheme,

  bg1: '#000000',
  bg2: '#121216',

  neutral1: colors.neutral1_dark,
  neutral2: colors.neutral2_dark,
}

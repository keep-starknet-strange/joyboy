import {ColorProp, ThemeColorNames} from '../styles';
import {useTheme} from './useTheme';

type Color = `#${string}` | `rgb${string}` | 'transparent';

export const useColor = (color: ColorProp): Color => {
  const {theme} = useTheme();

  if (color === 'transparent') return 'transparent';
  if (color.startsWith('#') || color.startsWith('rgb')) return color as Color;

  return (theme.colors[color as ThemeColorNames] ?? theme.colors.text) as Color;
};

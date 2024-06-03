import {ColorProp} from '../styles';
import {useTheme} from './useTheme';

export const useColor = (color: ColorProp) => {
  const theme = useTheme();

  if (color === 'transparent') return 'transparent';
  if (color.startsWith('#') || color.startsWith('rgb')) return color;

  return theme.colors[color] ?? theme.colors.text;
};

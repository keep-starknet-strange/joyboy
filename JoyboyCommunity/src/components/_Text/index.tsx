import {Text as NativeText, TextProps as NativeTextProps, TextStyle} from 'react-native';

import {useTheme} from '../../hooks';
import {ThemeColorNames, Typography, TypographyNames} from '../../styles';

export type TextProps = NativeTextProps & {
  color?: ThemeColorNames;
  weight?: TypographyNames;
  fontSize?: number;
  lineHeight?: number;
  align?: TextStyle['textAlign'];
};

export const Text: React.FC<TextProps> = (props) => {
  const {
    children,
    color = 'text',
    weight = 'regular',
    align = 'auto',
    fontSize = 14,
    lineHeight,
    style,
    ...restProps
  } = props;

  const theme = useTheme();

  const textStyles: TextStyle = {
    fontSize,
    lineHeight,
    color: theme.colors[color],
    textAlign: align,

    ...Typography[weight],
  };

  return (
    <NativeText {...restProps} style={[textStyles, style]}>
      {children}
    </NativeText>
  );
};

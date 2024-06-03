import {Text as NativeText, TextProps as NativeTextProps, TextStyle} from 'react-native';

import {useColor} from '../../hooks';
import {ColorProp, Typography, TypographyNames} from '../../styles';

export type TextProps = NativeTextProps & {
  color?: ColorProp;
  weight?: TypographyNames;
  fontSize?: number;
  lineHeight?: number;
  align?: TextStyle['textAlign'];
};

export const Text: React.FC<TextProps> = (props) => {
  const {
    children,
    color: colorProp = 'text',
    weight = 'regular',
    align = 'auto',
    fontSize = 14,
    lineHeight,
    style,
    ...restProps
  } = props;

  const color = useColor(colorProp);

  const textStyles: TextStyle = {
    fontSize,
    lineHeight,
    color,
    textAlign: align,

    ...Typography[weight],
  };

  return (
    <NativeText {...restProps} style={[textStyles, style]}>
      {children}
    </NativeText>
  );
};

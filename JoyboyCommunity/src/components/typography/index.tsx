import {StyleProp, Text, TextStyle} from 'react-native';
import styled from 'styled-components/native';

import {darkModeColors, lightModeColors} from '../../tokens/colors';
import {fontNameSpace} from '../../tokens/font';

interface IStyledTypographyType {
  variant?: keyof typeof fontNameSpace;
  colorCode?: typeof darkModeColors | typeof lightModeColors;
  align?: 'left' | 'center' | 'right';
}

export const StyledTypography = styled(Text)<IStyledTypographyType>`
  ${(props) => fontNameSpace[props.variant ?? 'ts17r']};
  color: ${(props) => props.colorCode ?? '#000000'};
  text-align: ${(props) => props.align ?? 'left'};
`;

interface TypographyProps extends IStyledTypographyType {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const Typography: React.FC<TypographyProps> = ({children, ...props}) => {
  return <StyledTypography {...(props as any)}>{children}</StyledTypography>;
};

import type { CSSProperties } from "react";
import React from "react";
import styled from "styled-components";
import { fontNameSpace } from "../../tokens/font";
import { Text } from "react-native";
import { darkModeColors, lightModeColors } from "../../tokens/colors";

interface IStyledTypographyType {
  variant?: keyof typeof fontNameSpace;
  colorCode?: typeof darkModeColors | typeof lightModeColors;
  align?: "left" | "center" | "right";
}

export const StyledTypography = styled(Text)<IStyledTypographyType>`
  ${(props) => fontNameSpace[props.variant ?? "ts17r"]};
  color: ${(props) => props.colorCode ?? "#000000"};
  text-align: ${(props) => props.align ?? "left"};
`;

interface TypographyProps extends IStyledTypographyType {
  children: React.ReactNode;
  style?: CSSProperties;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  ...props
}) => {
  return <StyledTypography {...props}>{children}</StyledTypography>;
};

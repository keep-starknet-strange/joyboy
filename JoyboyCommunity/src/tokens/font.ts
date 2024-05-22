import {css} from 'styled-components/native';

const textStyleMixin = (
  size: number,
  letterSpacing: number,
  bold?: number,
  lineHeight?: number,
) => {
  return css`
    font-size: ${size}px;
    letter-spacing: ${letterSpacing}px;
    line-height: ${lineHeight ?? size * 1.25}px;
    font-weight: ${bold ?? 400};
  `;
};

export const fontNameSpace = {
  ts12r: textStyleMixin(12, 0, 400),
  ts12m: textStyleMixin(12, 0, 500),
  ts13r: textStyleMixin(13, 0, 400),
  ts13m: textStyleMixin(13, 0, 500),
  ts15r: textStyleMixin(15, 0, 400),
  ts15m: textStyleMixin(15, 0, 500),
  ts15b: textStyleMixin(15, 0, 700),
  ts17r: textStyleMixin(17, 0, 400),
  ts17b: textStyleMixin(17, 0, 700),
  ts19m: textStyleMixin(19, 0, 500),
  ts24b: textStyleMixin(24, 0, 700),
  ts32b: textStyleMixin(32, -1, 700),
};

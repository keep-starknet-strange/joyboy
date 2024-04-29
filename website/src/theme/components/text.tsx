/**
 * Preset styles of the Rebass Text component
 */

import { Text, TextProps as TextPropsOriginal } from 'rebass'
import styled from 'styled-components'

enum FontFamily {
  MONTSERRAT = 'Montserrat',
  INTER = 'Inter',
}

interface TextWrapperCustomProps {
  color: keyof string
  fontFamily: FontFamily
}

const TextWrapper = styled(Text).withConfig({
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'fontFamily',
})<TextWrapperCustomProps>`
  color: ${({ color, theme }) => (theme as any)[color]};
  font-family: '${({ fontFamily = FontFamily.INTER }) => fontFamily}';
`

type TextProps = Omit<TextPropsOriginal, 'css'>

// todo: export each component individually
export const ThemedText = {
  Custom(props: TextProps) {
    return <TextWrapper color="neutral1" {...props} />
  },
  // todo: there should be just one `Body` with default color, no need to make all variations
  BodyPrimary(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={16} color="neutral1" fontFamily={FontFamily.INTER} {...props} />
  },
  BodySecondary(props: TextProps) {
    return <TextWrapper fontWeight={300} fontSize={16} color="neutral2" {...props} />
  },
  BodySmall(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={14} color="neutral1" {...props} />
  },
  HeadlineSmall(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={20} lineHeight="28px" color="neutral1" {...props} />
  },
  HeadlineMedium(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={24} color="neutral1" {...props} />
  },
  HeadlineLarge(props: TextProps) {
    return <TextWrapper fontWeight={700} fontSize={32} lineHeight="44px" color="neutral1" {...props} />
  },
  LargeHeader(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={36} color="neutral1" {...props} />
  },
  Hero(props: TextProps) {
    return <TextWrapper fontWeight={900} fontSize={64} color="neutral1" {...props} />
  },
  LabelSmall(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={14} color="neutral2" {...props} />
  },
  LabelMicro(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={12} color="neutral2" {...props} />
  },
  Caption(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={12} lineHeight="16px" color="neutral1" {...props} />
  },
  Link(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={14} color="accent1" {...props} />
  },
  MediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={20} color="neutral1" {...props} />
  },
  SubHeaderLarge(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={20} color="neutral1" {...props} />
  },
  SubHeader(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={16} color="neutral1" lineHeight="24px" {...props} />
  },
  SubHeaderSmall(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize={14} color="neutral2" {...props} />
  },
  UtilityBadge(props: TextProps) {
    return <TextWrapper fontWeight={485} fontSize="8px" lineHeight="12px" {...props} />
  },
}

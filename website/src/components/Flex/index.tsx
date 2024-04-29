import styled from 'styled-components'

// eslint-disable-next-line import/no-unused-modules
export const Row = styled.div<{
  gap?: number
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around'
  alignItems?: 'center' | 'baseline' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'normal'
}>`
  display: flex;
  flex-direction: row;
  ${({ gap }) => gap && `gap: ${gap}px;`}
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ alignItems = 'center' }) => alignItems};
`

export const Column = styled.div<{
  gap?: number
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around'
  alignItems?: 'center' | 'baseline' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'normal'
}>`
  display: flex;
  flex-direction: column;
  ${({ gap }) => gap && `gap: ${gap}px;`}
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ alignItems = 'center' }) => alignItems};
`

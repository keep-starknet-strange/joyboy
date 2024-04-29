import { getTheme } from './index'

type InferredTheme = ReturnType<typeof getTheme>

declare module 'styled-components' {
  export type DefaultTheme = InferredTheme
}

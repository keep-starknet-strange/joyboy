import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const Gallery = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#4B799F"
      strokeWidth={1.5}
      d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109C18.717 21.5 16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391C2.5 18.717 2.5 16.479 2.5 12Z"
    />
    <Path
      stroke="#4B799F"
      strokeWidth={1.5}
      d="M16.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
    />
    <Path
      stroke="#4B799F"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 22c-.62-2.225-2.066-4.218-4.123-5.666-2.22-1.561-5.005-2.387-7.861-2.331-.34-.001-.678.01-1.016.032"
    />
    <Path
      stroke="#4B799F"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 18c1.701-1.327 3.535-2.007 5.386-2a7.792 7.792 0 0 1 3.114.662"
    />
  </Svg>
)
export default Gallery

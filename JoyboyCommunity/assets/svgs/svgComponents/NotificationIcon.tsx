import * as React from "react"
import Svg, { SvgProps, Rect } from "react-native-svg"
const NotificationIcon = (props: SvgProps) => (
  <Svg
    width={37}
    height={5}
    fill="#000"
    {...props}
  >
    <Rect
      width={36}
      height={5}
      x={0.5}
      fill="#3C3C43"
      fillOpacity={0.3}
      rx={2.5}
    />
  </Svg>
)
export default NotificationIcon

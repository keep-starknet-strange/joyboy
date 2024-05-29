import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const CopyIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#4B799F"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m16.596 20.699-2.445.647c-2.263.6-3.395.899-4.281.408-.887-.49-1.182-1.58-1.773-3.758l-1.462-5.391c-.59-2.179-.886-3.268-.367-4.13.52-.863 1.651-1.163 3.914-1.762l4-1.06c2.264-.598 3.395-.898 4.282-.407.886.49 1.182 1.58 1.772 3.758l1.468 5.413c.251.926.377 1.39.239 1.825m-5.347 4.457c.752-.2.758-.202 1.343-.704l2.743-2.355c.749-.642 1.123-.963 1.261-1.398m-5.347 4.457s.588-4.593 1.904-5.199c1.493-.687 3.443.742 3.443.742"
    />
    <Path
      stroke="#4B799F"
      strokeWidth={1.5}
      d="M17 5.001c-.064-1.073-.243-1.749-.752-2.233-.78-.742-2.03-.746-4.532-.754l-4.423-.013c-2.502-.007-3.753-.01-4.528.727-.775.737-.771 1.928-.764 4.31l.018 5.893c.008 2.381.011 3.572.79 4.314.78.742 2.031.746 4.533.753l.681.002"
    />
  </Svg>
)
export default CopyIcon

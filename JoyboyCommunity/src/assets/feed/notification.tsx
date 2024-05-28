import * as React from "react"

const NotificationIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={34}
    fill="none"
    {...props}
  >
    <path
     {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.5}
      strokeWidth={1.5}
      d="M2.53 14.394c-.213 1.353.738 2.292 1.902 2.76 4.463 1.795 10.673 1.795 15.136 0 1.164-.468 2.115-1.407 1.902-2.76-.13-.832-.777-1.524-1.256-2.2-.627-.897-.689-1.874-.69-2.915C19.525 5.26 16.157 2 12 2 7.844 2 4.475 5.26 4.475 9.28c0 1.04-.062 2.018-.69 2.914-.478.676-1.124 1.368-1.255 2.2ZM9 21c.796.622 1.848 1 3 1s2.204-.378 3-1"
    />
  </svg>
)
export default NotificationIcon

import React from 'react';
import Svg, { Path } from 'react-native-svg';

function CopyIcon(props) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path 
        d="M16.5956 20.6989L14.1508 21.3462C11.8879 21.9453 10.7564 22.2448 9.86986 21.7542C8.98333 21.2636 8.68795 20.1744 8.09718 17.996L6.63512 12.6048C6.04436 10.4264 5.74898 9.33725 6.26846 8.4744C6.78794 7.61155 7.91941 7.312 10.1824 6.7129L14.1827 5.65384C16.4457 5.05474 17.5771 4.75519 18.4637 5.2458C19.3502 5.73642 19.6456 6.82561 20.2363 9.00398L21.7042 14.4166C21.9554 15.343 22.0811 15.8062 21.943 16.2417M16.5956 20.6989C17.3477 20.4998 17.3537 20.4966 17.9386 19.9948L20.6824 17.6404C21.4308 16.9983 21.805 16.6772 21.943 16.2417M16.5956 20.6989C16.5956 20.6989 17.1837 16.1058 18.5 15.5C19.9932 14.8128 21.943 16.2417 21.943 16.2417" 
        stroke="#4B799F" 
        strokeWidth="1.5" 
        strokeLinejoin="round" 
      />
      <Path 
        d="M17 5.00118C16.9356 3.92779 16.7573 3.2521 16.2484 2.76762C15.4689 2.02553 14.218 2.02184 11.716 2.01444L7.29321 2.00137C4.79129 1.99398 3.54033 1.99028 2.76535 2.72777C1.99037 3.46526 1.99402 4.65592 2.00132 7.03725L2.01938 12.9307C2.02668 15.3121 2.03033 16.5027 2.80984 17.2448C3.58935 17.9869 4.84031 17.9906 7.34224 17.998L8.02306 18" 
        stroke="#4B799F" 
        strokeWidth="1.5"
      />
    </Svg>
  );
}

export default CopyIcon;

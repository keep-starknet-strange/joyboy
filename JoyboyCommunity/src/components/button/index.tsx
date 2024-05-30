import {Pressable, PressableProps, StyleProp, TextStyle} from 'react-native';

import {Typography} from '../typography';
import styles from './styles';

export type ButtonProps = PressableProps & {
  left?: React.ReactNode;
  right?: React.ReactNode;
  small?: boolean;
  block?: boolean;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  left,
  right,
  small,
  block,
  textStyle,
  children,
  disabled,
  style: styleProp,
  ...pressableProps
}) => {
  const containerStyle = [
    styles.container,
    small && styles.small,
    block && styles.block,
    disabled && styles.disabled,
  ];

  return (
    <Pressable
      disabled={disabled}
      style={
        typeof styleProp === 'function'
          ? (state) => [...containerStyle, styleProp(state)]
          : [...containerStyle, styleProp]
      }
      {...pressableProps}
    >
      {left}
      <Typography
        style={[styles.text, small && styles.smallText, disabled && styles.disabledText, textStyle]}
      >
        {children}
      </Typography>
      {right}
    </Pressable>
  );
};

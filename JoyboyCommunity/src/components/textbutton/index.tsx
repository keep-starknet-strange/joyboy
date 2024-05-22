import {Pressable, PressableProps} from 'react-native';

import {Typography} from '../typography';
import styles from './styles';

export type TextButtonProps = PressableProps & {
  left?: React.ReactNode;
  right?: React.ReactNode;
  block?: boolean;
  children?: React.ReactNode;
};

export const TextButton: React.FC<TextButtonProps> = ({
  left,
  right,
  block,
  children,
  disabled,
  style: styleProp,
  ...pressableProps
}) => {
  const containerStyle = [styles.container, block && styles.block];

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
      <Typography style={[styles.text, disabled && styles.disabledText]}>{children}</Typography>
      {right}
    </Pressable>
  );
};

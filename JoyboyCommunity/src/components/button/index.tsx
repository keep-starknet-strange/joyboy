import {Pressable, PressableProps} from 'react-native';

import {Typography} from '../typography';
import styles from './styles';

export type ButtonProps = PressableProps & {
  left?: React.ReactNode;
  right?: React.ReactNode;
  block?: boolean;
  children?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  left,
  right,
  block,
  children,
  style: styleProp,
  ...pressableProps
}) => {
  const containerStyle = [styles.container, block && styles.block];

  return (
    <Pressable
      style={
        typeof styleProp === 'function'
          ? (state) => [...containerStyle, styleProp(state)]
          : [...containerStyle, styleProp]
      }
      {...pressableProps}
    >
      {left}
      <Typography style={styles.text}>{children}</Typography>
      {right}
    </Pressable>
  );
};

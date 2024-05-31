import {Pressable, PressableProps} from 'react-native';

import {ColorProp} from '../../styles';
import {Text} from '../Text';
import styles from './styles';

export type TextButtonProps = PressableProps & {
  color?: ColorProp;
  left?: React.ReactNode;
  right?: React.ReactNode;
  block?: boolean;
  children?: React.ReactNode;
};

export const TextButton: React.FC<TextButtonProps> = ({
  color = 'text',
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
      <Text
        weight="semiBold"
        fontSize={17}
        align="center"
        color={disabled ? 'buttonDisabledText' : color}
      >
        {children}
      </Text>
      {right}
    </Pressable>
  );
};

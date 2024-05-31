import {Pressable, PressableProps, StyleProp, TextStyle} from 'react-native';

import {useStyles} from '../../hooks';
import {Text} from '../Text';
import stylesheet from './styles';

export type ButtonProps = PressableProps & {
  variant?: 'default' | 'primary' | 'secondary';
  left?: React.ReactNode;
  right?: React.ReactNode;
  small?: boolean;
  block?: boolean;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
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
  const styles = useStyles(stylesheet, variant, block, disabled, small);

  return (
    <Pressable
      disabled={disabled}
      style={
        typeof styleProp === 'function'
          ? (state) => [styles.container, styleProp(state)]
          : [styles.container, styleProp]
      }
      {...pressableProps}
    >
      {left}
      <Text weight="semiBold" style={[styles.text, textStyle]}>
        {children}
      </Text>
      {right}
    </Pressable>
  );
};

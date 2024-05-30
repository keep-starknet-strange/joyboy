import {Feather} from '@expo/vector-icons';
import {Pressable, PressableProps, StyleProp, TextStyle} from 'react-native';

import styles from './styles';

export type IconButtonProps = PressableProps & {
  icon: React.ComponentProps<typeof Feather>['name'];
  size?: number;
  color?: string;
  iconStyle?: StyleProp<TextStyle>;
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size,
  color,
  iconStyle,
  disabled,
  style: styleProp,
  ...pressableProps
}) => {
  const containerStyle = [styles.container, disabled && styles.disabled];

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
      <Feather
        name={icon}
        size={size}
        color={color}
        style={[{width: size, height: size}, iconStyle]}
      />
    </Pressable>
  );
};

import {Feather} from '@expo/vector-icons';
import {Pressable, PressableProps, StyleProp, TextStyle} from 'react-native';

import {useColor, useStyles} from '../../hooks';
import {ColorProp} from '../../styles';
import stylesheet from './styles';

export type IconButtonProps = PressableProps & {
  icon: React.ComponentProps<typeof Feather>['name'];
  size?: number;
  color?: ColorProp;
  backgroundColor?: ColorProp;
  iconStyle?: StyleProp<TextStyle>;
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size,
  color: colorProp = 'text',
  backgroundColor: backgroundColorProp = 'surface',
  iconStyle,
  disabled,
  style: styleProp,
  ...pressableProps
}) => {
  const color = useColor(colorProp);
  const backgroundColor = useColor(backgroundColorProp);

  const styles = useStyles(stylesheet, disabled, backgroundColor);

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
      <Feather
        name={icon}
        size={size}
        color={color}
        style={[{width: size, height: size}, iconStyle]}
      />
    </Pressable>
  );
};

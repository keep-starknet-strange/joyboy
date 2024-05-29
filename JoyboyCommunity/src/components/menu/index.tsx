import {Feather} from '@expo/vector-icons';
import {useEffect} from 'react';
import {
  Pressable,
  PressableProps,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {Portal} from 'react-native-portalize';
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {Typography} from '../typography';
import styles from './styles';

export type MenuProps = {
  handle: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
};

export type MenuSubComponents = {
  Item: typeof MenuItem;
};

export type MenuItemProps = PressableProps & {
  label: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  color?: string;
};

const Menu: React.FC<MenuProps> & MenuSubComponents = ({handle, open, onClose, children}) => {
  const handleRef = useAnimatedRef<Animated.View>();
  const animation = useSharedValue(0);

  const {width} = useWindowDimensions();

  useEffect(() => {
    animation.value = withTiming(open ? 1 : 0, {duration: 150});
  }, [animation, open]);

  const animatedMenuStyles = useAnimatedStyle(() => {
    const menuWidth = Math.min(width / 1.6, 320);

    const menuStyle = {
      ...styles.menu,
      width: menuWidth,
      opacity: animation.value,
    };

    const handleBounds = measure(handleRef);

    if (!handleBounds) return {};

    const X = handleBounds.pageX;
    const Y = handleBounds.pageY + handleBounds.height + 8;

    if (X + menuWidth > width) {
      return {
        ...menuStyle,
        top: Y,
        left: width - menuWidth - 8,
      };
    } else {
      return {
        ...menuStyle,
        top: Y,
        left: X,
      };
    }
  }, [width, animation]);

  return (
    <View style={styles.container}>
      <Animated.View ref={handleRef}>{handle}</Animated.View>

      {open ? (
        <Portal>
          <View style={styles.menuContainer}>
            <Animated.View style={animatedMenuStyles}>{children}</Animated.View>
          </View>

          <TouchableWithoutFeedback onPress={onClose} style={styles.outsideContainer}>
            <View style={styles.outside} />
          </TouchableWithoutFeedback>
        </Portal>
      ) : null}
    </View>
  );
};

export const MenuItem: React.FC<MenuItemProps> = ({label, icon, color, ...pressableProps}) => {
  return (
    <Pressable style={styles.menuItem} {...pressableProps}>
      <Typography style={styles.menuItemLabel}>{label}</Typography>

      {icon ? <Feather name={icon} color={color} size={24} /> : null}
    </Pressable>
  );
};

Menu.Item = MenuItem;

export {Menu};

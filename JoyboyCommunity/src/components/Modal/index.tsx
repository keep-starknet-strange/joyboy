import React from 'react';
import {View} from 'react-native';
import {Portal} from 'react-native-portalize';

import {useStyles} from '../../hooks';
import {Button, ButtonProps} from '../Button';
import {Text} from '../Text';
import stylesheet from './styles';

export type ModalProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  visible?: boolean;
  buttons: {
    label: string;
    type: ButtonProps['variant'];
    onPress: () => void;
  }[];
};

export const Modal: React.FC<ModalProps> = ({
  title,
  icon,
  description,
  visible = true,
  buttons,
}) => {
  const styles = useStyles(stylesheet);

  if (!visible) return null;

  return (
    <Portal>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.content}>
            {icon && <View style={styles.icon}>{icon}</View>}

            <Text weight="bold" fontSize={21} lineHeight={24} style={styles.title}>
              {title}
            </Text>

            <Text
              weight="semiBold"
              color="textSecondary"
              align="center"
              fontSize={15}
              lineHeight={20}
            >
              {description}
            </Text>
          </View>

          <View style={styles.buttons}>
            {buttons.map((button, index) => (
              <Button key={index.toString()} block variant={button.type} onPress={button.onPress}>
                {button.label}
              </Button>
            ))}
          </View>
        </View>
      </View>
    </Portal>
  );
};

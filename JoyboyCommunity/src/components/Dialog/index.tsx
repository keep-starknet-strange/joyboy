import React from 'react';
import {View} from 'react-native';

import {useStyles} from '../../hooks';
import {Button, ButtonProps} from '../Button';
import {Modal} from '../Modal';
import {Text} from '../Text';
import stylesheet from './styles';

export type DialogProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  buttons: {
    label: string;
    type: ButtonProps['variant'];
    onPress: () => void;
  }[];
};

export const Dialog: React.FC<DialogProps> = ({title, icon, description, buttons}) => {
  const styles = useStyles(stylesheet);

  return (
    <Modal style={styles.modal}>
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}

        <Text weight="bold" fontSize={21} lineHeight={24} style={styles.title}>
          {title}
        </Text>

        <Text weight="semiBold" color="textSecondary" align="center" fontSize={15} lineHeight={20}>
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
    </Modal>
  );
};

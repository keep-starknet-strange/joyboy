import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {Portal} from 'react-native-portalize';

import {TippingModalIcon} from '../../assets/icons';
import {Button, Text} from '../../components';
import {useStyles} from '../../hooks';
import {MainStackNavigationProps} from '../../types';
import stylesheet from './styles';

export type TippingModalProps = {
  user: string;
  amount: number;
  visible?: boolean;
};

export const TippingModal: React.FC<TippingModalProps> = ({user, amount, visible = true}) => {
  const styles = useStyles(stylesheet);

  const navigation = useNavigation<MainStackNavigationProps>();

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  if (!visible) return null;

  return (
    <Portal>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.icon}>
            <TippingModalIcon />
          </View>

          <View style={styles.content}>
            <Text color="#14142C" weight="bold" fontSize={21} lineHeight={24}>
              Tipped {user}
            </Text>
            <Text color="#EC796B" weight="bold" fontSize={21} lineHeight={24}>
              {amount} JBY
            </Text>
            <Text color="#EC796B" weight="semiBold" fontSize={15} lineHeight={24}>
              Keep spreading love
            </Text>
            <Button style={styles.button} onPress={handleHomePress}>
              Home
            </Button>
          </View>
        </View>
      </View>
    </Portal>
  );
};
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, View} from 'react-native';
import {Portal} from 'react-native-portalize';

import {useStyles} from '../../hooks';
import {MainStackNavigationProps} from '../../types';
import {Button, Text} from '..';
import stylesheet from './styles';

export type TippingModalProps = {
  user: string;
  symbol: string;
  amount: number;
  visible?: boolean;
};

export const TippingModal: React.FC<TippingModalProps> = ({
  user,
  symbol,
  amount,
  visible = true,
}) => {
  const styles = useStyles(stylesheet);

  const navigation = useNavigation<MainStackNavigationProps>();

  if (!visible) return null;

  return (
    <Portal>
      <View style={styles.container}>
        <View style={styles.background}>
          <Image
            style={styles.backgroundImage}
            source={require('../../assets/tipping-bg.png')}
            resizeMode="cover"
          />
        </View>

        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.logo}>
              <Image source={require('../../assets/tipping-modal.png')} resizeMode="cover" />
            </View>

            <View style={styles.content}>
              <Text style={styles.tipUser} weight="bold" fontSize={21} lineHeight={24}>
                Tipped {user}
              </Text>
              <Text style={styles.tipAmount} weight="bold" fontSize={21} lineHeight={24}>
                {amount} {symbol}
              </Text>
              <Text style={styles.tipText} weight="medium" fontSize={15} lineHeight={24}>
                Keep spreading love
              </Text>

              <Button
                style={styles.button}
                onPress={() => {
                  navigation.navigate('Home');
                }}
                variant="secondary"
              >
                Home
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Portal>
  );
};

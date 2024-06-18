import React from 'react';
import {Image, View} from 'react-native';

import {Button, Modal, Text} from '../../components';
import {useStyles} from '../../hooks';
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

  if (!visible) return null;

  return (
    <Modal>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Image
            style={styles.logoImage}
            source={require('../../assets/tipping-modal.png')}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text color="text" weight="bold" fontSize={21} lineHeight={24}>
          Tipped {user}
        </Text>
        <Text color="primary" weight="bold" fontSize={21} lineHeight={24}>
          {amount} {symbol}
        </Text>
        <Text color="textSecondary" weight="medium" fontSize={15} lineHeight={24}>
          Keep spreading love
        </Text>
      </View>

      <Button block variant="secondary">
        Continue
      </Button>
    </Modal>
  );
};

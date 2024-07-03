import React from 'react';
import {Image, View} from 'react-native';

import {Button, Modal, Text} from '../../components';
import {useStyles} from '../../hooks';
import stylesheet from './styles';

export type TipSuccessModalProps = {
  user?: string;
  symbol: string;
  amount: number;
  hide: () => void;
};

export const TipSuccessModal: React.FC<TipSuccessModalProps> = ({user, symbol, amount, hide}) => {
  const styles = useStyles(stylesheet);

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
        <Text
          color="text"
          weight="bold"
          fontSize={21}
          lineHeight={24}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          Tipped {user}
        </Text>

        <Text color="primary" weight="bold" fontSize={21} lineHeight={24}>
          {amount} {symbol}
        </Text>

        <Text color="textSecondary" weight="medium" fontSize={15} lineHeight={24}>
          Keep spreading love
        </Text>
      </View>

      <Button block variant="secondary" onPress={hide}>
        Continue
      </Button>
    </Modal>
  );
};

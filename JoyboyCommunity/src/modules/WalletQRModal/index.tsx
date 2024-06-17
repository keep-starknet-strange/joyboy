import {getArgentMobileURL} from '@starknet-wc/react';
import * as Linking from 'expo-linking';
import {Alert, useWindowDimensions, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import {Button, Modal, Text} from '../../components';
import {useStyles} from '../../hooks';
import {Spacing} from '../../styles';
import {getArgentAppStoreURL} from '../../utils/helpers';
import stylesheet from './styles';

export const WalletQRModal: React.FC<{url: string}> = ({url}) => {
  const styles = useStyles(stylesheet);

  const {width} = useWindowDimensions();

  const qrWidth = (width - Spacing.xlarge * 2 - Spacing.large * 2) * 0.9;

  const onConnectPress = async () => {
    const argentUrl = getArgentMobileURL(url);

    const canOpen = await Linking.canOpenURL(argentUrl);

    if (!canOpen) {
      const argentAppUrl = getArgentAppStoreURL();

      Alert.alert('Argent not installed', 'Would you like to install Argent?', [
        {
          style: 'default',
          text: 'Open App Store',
          onPress: () => Linking.openURL(argentAppUrl),
        },
        {
          style: 'cancel',
          text: 'Cancel',
        },
      ]);
      return;
    }

    await Linking.openURL(argentUrl);
  };

  return (
    <Modal>
      <Text fontSize={16} weight="semiBold">
        Scan this QR code with your wallet or click the button below to connect
      </Text>

      <View style={styles.qrCode}>
        <QRCode size={qrWidth} value={url} />
      </View>

      <View style={styles.buttons}>
        <Button variant="primary" onPress={onConnectPress}>
          Open in Argent
        </Button>

        <Button variant="default">Cancel</Button>
      </View>
    </Modal>
  );
};

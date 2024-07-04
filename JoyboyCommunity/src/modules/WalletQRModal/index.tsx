import {getArgentMobileURL} from '@starknet-wc/react';
import * as Linking from 'expo-linking';
import {View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import {Button, Modal, Text} from '../../components';
import {useStyles, useWindowDimensions} from '../../hooks';
import {useDialog} from '../../hooks/modals';
import {Spacing} from '../../styles';
import {getArgentAppStoreURL} from '../../utils/helpers';
import stylesheet from './styles';

export const WalletQRModal: React.FC<{url: string; hideModal: () => void}> = ({url, hideModal}) => {
  const styles = useStyles(stylesheet);

  const {width} = useWindowDimensions();
  const {showDialog, hideDialog} = useDialog();

  const qrWidth = (width - Spacing.xlarge * 2 - Spacing.large * 2) * 0.9;

  const onConnectPress = async () => {
    const argentUrl = getArgentMobileURL(url);

    const canOpen = await Linking.canOpenURL(argentUrl);

    if (!canOpen) {
      const argentAppUrl = getArgentAppStoreURL();

      showDialog({
        title: 'Argent not installed',
        description: 'Would you like to install Argent?',
        buttons: [
          {
            type: 'primary',
            label: 'Open App Store',
            onPress: () => {
              Linking.openURL(argentAppUrl);
              hideDialog();
            },
          },
          {
            type: 'default',
            label: 'Cancel',
            onPress: hideDialog,
          },
        ],
      });
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

        <Button variant="default" onPress={hideModal}>
          Cancel
        </Button>
      </View>
    </Modal>
  );
};

import {useConnect} from '@starknet-react/core';
import * as Linking from 'expo-linking';
import {Platform, Pressable, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {Button, Modal, Text} from '../../components';
import {ARGENT_X_INSTALL_URL, BRAAVOS_INSTALL_URL} from '../../constants/urls';
import {useStyles, useTheme} from '../../hooks';
import {useDialog} from '../../hooks/modals/useDialog';
import stylesheet from './styles';

export type WalletModalProps = {
  hide: () => void;
};

export const WalletModal: React.FC<WalletModalProps> = ({hide}) => {
  const {theme} = useTheme();
  const styles = useStyles(stylesheet);

  const {connect, connectors} = useConnect();
  const {showDialog, hideDialog} = useDialog();

  return (
    <Modal>
      <Text fontSize={16} weight="semiBold">
        Please choose a wallet to connect
      </Text>

      <View style={styles.connectors}>
        {connectors.map((connector) => {
          const icon = connector.icon[theme.dark ? 'dark' : 'light'];

          return (
            <Pressable
              key={connector.id}
              onPress={() => {
                if (
                  (connector.id === 'argentX' || connector.id === 'braavos') &&
                  !(globalThis as any)[`starknet_${connector.id}`]
                ) {
                  showDialog({
                    title: 'Wallet is not available',
                    description: `${connector.name} is not available to use. Please install the wallet and try again.`,
                    buttons: [
                      {
                        type: 'secondary',
                        label: `Install ${connector.name}`,
                        onPress: () => {
                          if (connector.id === 'argentX') Linking.openURL(ARGENT_X_INSTALL_URL);
                          if (connector.id === 'braavos') Linking.openURL(BRAAVOS_INSTALL_URL);
                          hideDialog();
                        },
                      },
                      {
                        type: 'default',
                        label: 'Close',
                        onPress: hideDialog,
                      },
                    ],
                  });
                  hide();
                  return;
                }
                connect({connector});
                hide();
              }}
              style={styles.connector}
            >
              {Platform.OS !== 'web' && icon ? <SvgXml xml={icon} width={32} height={32} /> : null}

              <Text weight="semiBold">{connector.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button variant="default" onPress={hide}>
        Cancel
      </Button>
    </Modal>
  );
};

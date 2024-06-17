import {useConnect} from '@starknet-react/core';
import {Pressable, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {Button, Modal, Text} from '../../components';
import {useStyles, useTheme} from '../../hooks';
import stylesheet from './styles';

export type WalletModalProps = {
  hide: () => void;
};

export const WalletModal: React.FC<WalletModalProps> = ({hide}) => {
  const theme = useTheme();
  const styles = useStyles(stylesheet);

  const {connect, connectors} = useConnect();

  return (
    <Modal>
      <Text fontSize={16} weight="semiBold">
        Please choose a wallet to connect
      </Text>

      <View style={styles.connectors}>
        {connectors.map((connector) => (
          <Pressable
            key={connector.id}
            onPress={() => {
              connect({connector});
              hide();
            }}
            style={styles.connector}
          >
            <SvgXml xml={connector.icon[theme.dark ? 'dark' : 'light']} width={32} height={32} />

            <Text weight="semiBold">{connector.name}</Text>
          </Pressable>
        ))}
      </View>

      <Button variant="default" onPress={hide}>
        Cancel
      </Button>
    </Modal>
  );
};

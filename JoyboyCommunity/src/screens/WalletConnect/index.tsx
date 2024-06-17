import {useAccount, useConnect} from '@starknet-react/core';
import {View} from 'react-native';

import {Button, Header, Text} from '../../components';

export const WalletConnect: React.FC = () => {
  const {connect, connectors} = useConnect();

  const account = useAccount();

  return (
    <View>
      <Header showLogo />

      <View style={{padding: 16}}>
        <View style={{marginBottom: 24}}>
          <Text>WalletConnect</Text>

          {account?.address ? (
            <Text>Connected account: {account.address}</Text>
          ) : (
            <Text>No accounts connected</Text>
          )}
        </View>

        {connectors.map((connector) => (
          <View key={connector.id} style={{marginBottom: 30}}>
            <Text>Connect to {connector.name}</Text>

            <Button onPress={() => connect({connector})}>Connect</Button>
          </View>
        ))}
      </View>
    </View>
  );
};

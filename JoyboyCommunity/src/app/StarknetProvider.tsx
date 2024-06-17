import {mainnet} from '@starknet-react/chains';
import {
  argent,
  braavos,
  publicProvider,
  StarknetConfig,
  useInjectedConnectors,
  voyager,
} from '@starknet-react/core';
import {
  ConnectorProvider as StarknetWCProvider,
  getArgentMobileURL,
  useArgentMobileConnector,
} from '@starknet-wc/react';
import * as Linking from 'expo-linking';
import {Platform, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {constants} from 'starknet';

import {Button, Text} from '../components';

export const StarknetReactProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const {connectors} = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: 'onlyIfNoConnectors',
    // Randomize the order of the connectors.
    order: 'random',
  });

  const argentMobileConnector = useArgentMobileConnector();

  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={publicProvider()}
      connectors={[
        argentMobileConnector({
          chain: constants.NetworkName.SN_MAIN,
          wcProjectId: 'a9b4b052eb741f95a54c90ac5bdb343e',
          dappName: 'Joyboy',
          description: 'Joyboy Starknet dApp',
          url: 'https://joyboy.community',
        }),

        ...(Platform.OS === 'web' ? connectors : []),
      ]}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
};

const Modal: React.FC<{url: string}> = ({url}) => (
  <View
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }}
  >
    <View style={{width: '75%', padding: 12, backgroundColor: 'white'}}>
      <Text style={{marginBottom: 24}}>{url}</Text>

      <QRCode size={250} value={getArgentMobileURL(url)} />

      <Button
        onPress={async () => {
          const argentUrl = encodeURIComponent(getArgentMobileURL(url));
          const openUrl = `https://unruggable.meme/wallet-redirect/${argentUrl}`;

          const canOpen = await Linking.canOpenURL(openUrl);

          if (!canOpen) {
            alert('Argent is not installed');
            return;
          }

          await Linking.openURL(openUrl);
        }}
      >
        Open in Argent
      </Button>
    </View>
  </View>
);

export const StarknetProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <StarknetWCProvider modal={Modal}>
      <StarknetReactProvider>{children}</StarknetReactProvider>
    </StarknetWCProvider>
  );
};

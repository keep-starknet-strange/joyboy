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
  useArgentMobileConnector,
} from '@starknet-wc/react';
import {Platform} from 'react-native';
import {constants} from 'starknet';

import {WalletQRModal} from '../modules/WalletQRModal';

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
          // TODO: Move this to ENV
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

export const StarknetProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <StarknetWCProvider modal={WalletQRModal}>
      <StarknetReactProvider>{children}</StarknetReactProvider>
    </StarknetWCProvider>
  );
};

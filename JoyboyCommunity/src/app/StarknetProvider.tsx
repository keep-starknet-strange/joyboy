import {sepolia} from '@starknet-react/chains';
import {
  argent,
  braavos,
  infuraProvider,
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

import {RpcProviderProvider} from '../context/RpcProvider';
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

  const providers = infuraProvider({apiKey: '98f462b6b2644cadae88bdb695e467bf'});
  const provider = providers(sepolia);

  return (
    <RpcProviderProvider provider={provider}>
      <StarknetConfig
        chains={[sepolia]}
        provider={providers}
        connectors={[
          argentMobileConnector({
            chain: constants.NetworkName.SN_SEPOLIA,
            // TODO: Move this to ENV
            wcProjectId: 'a9b4b052eb741f95a54c90ac5bdb343e',
            dappName: 'Joyboy',
            description: 'Joyboy Starknet dApp',
            url: 'https://joyboy.community',
            provider,
          }),

          ...(Platform.OS === 'web' ? connectors : []),
        ]}
        explorer={voyager}
      >
        {children}
      </StarknetConfig>
    </RpcProviderProvider>
  );
};

export const StarknetProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <StarknetWCProvider modal={WalletQRModal}>
      <StarknetReactProvider>{children}</StarknetReactProvider>
    </StarknetWCProvider>
  );
};

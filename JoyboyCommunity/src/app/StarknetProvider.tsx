import {mainnet, sepolia} from '@starknet-react/chains';
import {
  argent,
  braavos,
  StarknetConfig,
  useInjectedConnectors,
  voyager,
} from '@starknet-react/core';
import {
  ConnectorProvider as StarknetWCProvider,
  useArgentMobileConnector,
} from '@starknet-wc/react';
import {Platform} from 'react-native';

import {NETWORK_NAME, WALLET_CONNECT_ID} from '../constants/env';
import {RpcProviderProvider} from '../context/RpcProvider';
import {WalletQRModal} from '../modules/WalletQRModal';
import {providers} from '../services/provider';

export const StarknetReactProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const chain = {
    SN_MAIN: mainnet,
    SN_SEPOLIA: sepolia,
  }[NETWORK_NAME];

  const provider = providers(chain);

  const {connectors: injected} = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: 'always',
  });

  const argentMobileConnector = useArgentMobileConnector();

  return (
    <RpcProviderProvider provider={provider}>
      <StarknetConfig
        chains={[chain]}
        provider={providers}
        connectors={[
          argentMobileConnector({
            chain: NETWORK_NAME,
            wcProjectId: WALLET_CONNECT_ID,
            dappName: 'Joyboy',
            description: 'Joyboy Starknet dApp',
            url: 'https://joyboy.community',
            provider,
          }),

          ...(Platform.OS === 'web' ? injected : []),
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

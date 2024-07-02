import {Chain} from '@starknet-react/chains';
import {constants, RpcProvider} from 'starknet';

import {NETWORK_NAME, PROVIDER_URL} from '../constants/env';

export const provider = new RpcProvider({
  nodeUrl: PROVIDER_URL,
  chainId: constants.StarknetChainId[NETWORK_NAME],
});

export const providers = (_chain: Chain) => provider;

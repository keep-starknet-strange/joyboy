import {Chain} from '@starknet-react/chains';
import {RpcProvider} from 'starknet';

import {CHAIN_ID, PROVIDER_URL} from '../constants/env';

export const provider = new RpcProvider({
  nodeUrl: PROVIDER_URL,
  chainId: CHAIN_ID,
});

export const providers = (_chain: Chain) => provider;

import {constants, RpcProvider} from 'starknet';

import {NETWORK_NAME} from '@/constants/misc';

if (!process.env.PROVIDER_URL) throw new Error('PROVIDER_URL is not set');

export const provider = new RpcProvider({
  nodeUrl: process.env.PROVIDER_URL,
  chainId: constants.StarknetChainId[NETWORK_NAME],
});

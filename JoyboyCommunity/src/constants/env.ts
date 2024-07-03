/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {constants} from 'starknet';

export const NETWORK_NAME = process.env.EXPO_PUBLIC_NETWORK as constants.NetworkName;
export const CHAIN_ID = constants.StarknetChainId[NETWORK_NAME];
export const PROVIDER_URL = process.env.EXPO_PUBLIC_PROVIDER_URL!;

export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL!;

export const WALLET_CONNECT_ID = process.env.EXPO_PUBLIC_WC_ID!;

if (!Object.keys(constants.NetworkName).includes(NETWORK_NAME)) {
  throw new Error(`Invalid network name: ${NETWORK_NAME}`);
}
if (!PROVIDER_URL) throw new Error('Missing PROVIDER_URL env variable');
if (!BACKEND_URL) throw new Error('Missing BACKEND_URL env variable');
if (!WALLET_CONNECT_ID) throw new Error('Missing WALLET_CONNECT_ID env variable');

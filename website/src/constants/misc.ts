import {BASE_URL as AVNU_BASE_URL, SEPOLIA_BASE_URL as AVNU_SEPOLIA_BASE_URL} from '@avnu/avnu-sdk';
import {constants} from 'starknet';

export enum Entrypoint {
  // ERC-20
  NAME = 'name',
  SYMBOL = 'symbol',
  APPROVE = 'approve',
  TRANSFER = 'transfer',

  // Escrow
  DEPOSIT = 'deposit',
  CLAIM = 'claim',
  GET_DEPOSIT = 'get_deposit',
}

export const NETWORK_NAME = process.env.NETWORK_NAME as constants.NetworkName;
if (!NETWORK_NAME) throw new Error('NETWORK_NAME is not set');

export const CHAIN_ID = constants.StarknetChainId[NETWORK_NAME];

export const AVNU_URL = NETWORK_NAME === 'SN_SEPOLIA' ? AVNU_SEPOLIA_BASE_URL : AVNU_BASE_URL;

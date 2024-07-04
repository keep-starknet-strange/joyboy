import {getChecksumAddress} from 'starknet';

import {CHAIN_ID} from '../constants/env';
import {EventKey} from '../constants/misc';
import {TOKEN_ADDRESSES} from '../constants/tokens';

export type ContractEvent = {
  from_address: string;
  keys: string[];
  data: string[];
  block_hash: string;
  block_number: number;
  transaction_hash: string;
};

export const parseDepositEvent = (event: ContractEvent) => {
  if (event.keys[0] === EventKey.DepositEvent) {
    return {
      event,
      sender: event.keys[2],
      token: TOKEN_ADDRESSES[CHAIN_ID][getChecksumAddress(event.data[2])],
      amount: event.data[0],
      depositId: Number(event.keys[1]),
    };
  }

  if (event.keys[0] === EventKey.TransferEvent) {
    return {
      event,
      sender: event.keys[1],
      token: TOKEN_ADDRESSES[CHAIN_ID][getChecksumAddress(event.data[2])],
      amount: event.data[0],
    };
  }

  return undefined;
};

export const parseClaimEvent = (event: ContractEvent) => {
  if (event.keys[0] === EventKey.ClaimEvent) {
    return {
      event,
      sender: event.keys[2],
      token: TOKEN_ADDRESSES[CHAIN_ID][getChecksumAddress(event.data[1])],
      amount: event.data[0],
      starknetRecipient: event.keys[5],
      depositId: Number(event.keys[1]),
    };
  }

  return undefined;
};

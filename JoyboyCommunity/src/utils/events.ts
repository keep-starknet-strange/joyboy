import {constants, getChecksumAddress} from 'starknet';

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

export const parseDepositEvents = (event: ContractEvent, chainId: constants.StarknetChainId) => {
  if (event.keys[0] === EventKey.DepositEvent) {
    return {
      sender: event.keys[2],
      token: TOKEN_ADDRESSES[chainId][getChecksumAddress(event.data[2])],
      amount: event.data[0],
      depositId: Number(event.keys[1]),
    };
  }

  if (event.keys[0] === EventKey.TransferEvent) {
    return {
      sender: event.keys[1],
      token: TOKEN_ADDRESSES[chainId][getChecksumAddress(event.data[2])],
      amount: event.data[0],
    };
  }

  return undefined;
};

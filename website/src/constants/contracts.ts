import {constants} from 'starknet';

export const ESCROW_ADDRESSES = {
  [constants.StarknetChainId.SN_MAIN]: '', // TODO: Add mainnet escrow address
  [constants.StarknetChainId.SN_SEPOLIA]:
    '0x078a022e6906c83e049a30f7464b939b831ecbe47029480d7e89684f20c8d263',
};

export const ETH_ADDRESSES = {
  [constants.StarknetChainId.SN_MAIN]:
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  [constants.StarknetChainId.SN_SEPOLIA]:
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
};

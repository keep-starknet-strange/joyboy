import {constants, getChecksumAddress} from 'starknet';

export type Token = {
  name: string;
  symbol: TokenSymbol;
  decimals: number;
  address: string;
};
export type MultiChainToken = Record<constants.StarknetChainId, Token>;
export type MultiChainTokens = Record<TokenSymbol, MultiChainToken>;

export enum TokenSymbol {
  ETH = 'ETH',
  STRK = 'STRK',
  USDC = 'USDC',
}

export const ETH: MultiChainToken = {
  [constants.StarknetChainId.SN_MAIN]: {
    name: 'Ether',
    symbol: TokenSymbol.ETH,
    decimals: 18,
    address: getChecksumAddress(
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    ),
  },
  [constants.StarknetChainId.SN_SEPOLIA]: {
    name: 'Ether',
    symbol: TokenSymbol.ETH,
    decimals: 18,
    address: getChecksumAddress(
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    ),
  },
};

export const STRK: MultiChainToken = {
  [constants.StarknetChainId.SN_MAIN]: {
    name: 'Stark',
    symbol: TokenSymbol.STRK,
    decimals: 18,
    address: getChecksumAddress(
      '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    ),
  },
  [constants.StarknetChainId.SN_SEPOLIA]: {
    name: 'Stark',
    symbol: TokenSymbol.STRK,
    decimals: 18,
    address: getChecksumAddress(
      '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    ),
  },
};

export const USDC: MultiChainToken = {
  [constants.StarknetChainId.SN_MAIN]: {
    name: 'USDC',
    symbol: TokenSymbol.USDC,
    decimals: 6,
    address: getChecksumAddress(
      '0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    ),
  },
  [constants.StarknetChainId.SN_SEPOLIA]: {
    name: 'USDC',
    symbol: TokenSymbol.USDC,
    decimals: 6,
    address: getChecksumAddress(
      '0x053b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080',
    ),
  },
};

export const TOKENS: MultiChainTokens = {
  [TokenSymbol.ETH]: ETH,
  [TokenSymbol.STRK]: STRK,
  [TokenSymbol.USDC]: USDC,
};

export const TOKEN_ADDRESSES: Record<
  constants.StarknetChainId,
  Record<string, Token>
> = Object.fromEntries(
  Object.values(constants.StarknetChainId).map((chainId) => [
    chainId,
    Object.fromEntries(
      Object.values(TOKENS).map((tokenWithChain) => [
        tokenWithChain[chainId].address,
        tokenWithChain[chainId],
      ]),
    ),
  ]),
) as Record<constants.StarknetChainId, Record<string, Token>>;

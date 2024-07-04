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

export enum EventKey {
  DepositEvent = '0xa1db419bdf20c7726cf74c30394c4300e5645db4e3cacaf897da05faabae03',
  TransferEvent = '0x15884c9d44b49803fec52bec32166b4a87f9683725e9c83e8b0bc12306fc10',
  ClaimEvent = '0x1338111cc170c56fecb176d35cca4c04823f0b8d9c64cfb956c97b236ea6fc6',
}

export const DEFAULT_TIMELOCK = 7 * 24 * 60 * 60 * 1_000; // 7 days

export const WEB_MAX_WIDTH = 520;

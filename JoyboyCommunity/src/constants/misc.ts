export enum Entrypoint {
  // ERC-20
  NAME = 'name',
  SYMBOL = 'symbol',
  APPROVE = 'approve',
  TRANSFER = 'transfer',

  // Escrow
  DEPOSIT = 'deposit',
  CLAIM = 'claim',
}

export const DEFAULT_TIMELOCK = 7 * 24 * 60 * 60 * 1_000; // 7 days

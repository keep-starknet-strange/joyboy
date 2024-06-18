export enum Entrypoint {
  NAME = 'name',
  SYMBOL = 'symbol',
  APPROVE = 'approve',
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit',
}

export const DEFAULT_TIMELOCK = 7 * 24 * 60 * 60 * 1_000; // 7 days

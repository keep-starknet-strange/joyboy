const ErrorCodesArray = [
  'BAD_REQUEST',
  'INVALID_EVENT',
  'INVALID_EVENT_SIGNATURE',
  'INVALID_EVENT_CONTENT',
  'INVALID_ADDRESS',
  'DEPOSIT_NOT_FOUND',
  'INVALID_GAS_AMOUNT',
  'TRANSACTION_ERROR',
  'ESTIMATION_ERROR',
] as const;

export type ErrorCode = (typeof ErrorCodesArray)[number];

export const ErrorCode = Object.fromEntries(ErrorCodesArray.map((code) => [code, code])) as {
  [K in ErrorCode]: K;
};

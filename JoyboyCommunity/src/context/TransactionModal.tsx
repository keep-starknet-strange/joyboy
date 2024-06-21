import {createContext, useCallback, useMemo, useState} from 'react';
import {GetTransactionReceiptResponse} from 'starknet';

import {TransactionModal} from '../modules/TransactionModal';

export type TransactionModalContextType = {
  shown: boolean;
  transactionHash: string | undefined;
  show: (txHash?: string, onReceipt?: (receipt: GetTransactionReceiptResponse) => void) => void;
  hide: () => void;
};

export const TransactionModalContext = createContext<TransactionModalContextType | null>(null);

export const TransactionModalProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [shown, setShown] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | undefined>();
  const [onReceiptCallback, setOnReceiptCallback] = useState<
    ((receipt: GetTransactionReceiptResponse) => void) | undefined
  >();

  const show = useCallback((txHash?: string, onReceipt?: typeof onReceiptCallback) => {
    setShown(true);
    setTransactionHash(txHash);
    setOnReceiptCallback(() => onReceipt);
  }, []);

  const hide = useCallback(() => {
    setShown(false);
    setTransactionHash(undefined);
    setOnReceiptCallback(undefined);
  }, []);

  const context = useMemo(
    () => ({shown, transactionHash, show, hide}),
    [shown, transactionHash, show, hide],
  );

  return (
    <TransactionModalContext.Provider value={context}>
      {children}

      {shown && (
        <TransactionModal
          hide={hide}
          transactionHash={transactionHash}
          onReceipt={onReceiptCallback}
        />
      )}
    </TransactionModalContext.Provider>
  );
};

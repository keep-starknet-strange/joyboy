import {useContext} from 'react';

import {TransactionModalContext, TransactionModalContextType} from '../../context/TransactionModal';

export const useTransactionModal = (): TransactionModalContextType => {
  const context = useContext(TransactionModalContext);

  if (!context) {
    throw new Error('useTransactionModal must be used within a TransactionModalProvider');
  }

  return context;
};

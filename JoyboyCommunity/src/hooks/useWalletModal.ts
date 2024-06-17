import {useContext} from 'react';

import {WalletModalContext, WalletModalContextType} from '../context/WalletModal';

export const useWalletModal = (): WalletModalContextType => {
  const context = useContext(WalletModalContext);

  if (!context) {
    throw new Error('useWalletModal must be used within a WalletModalProvider');
  }

  return context;
};

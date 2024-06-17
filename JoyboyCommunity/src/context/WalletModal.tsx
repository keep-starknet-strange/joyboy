import {createContext, useCallback, useMemo, useState} from 'react';

import {WalletModal} from '../modules/WalletModal';

export type WalletModalContextType = {
  shown: boolean;
  show: () => void;
  hide: () => void;
};

export const WalletModalContext = createContext<WalletModalContextType | null>(null);

export const WalletModalProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [shown, setShown] = useState(false);

  const show = useCallback(() => setShown(true), []);
  const hide = useCallback(() => setShown(false), []);

  const context = useMemo(() => ({shown, show, hide}), [shown, show, hide]);

  return (
    <WalletModalContext.Provider value={context}>
      {children}

      {shown && <WalletModal hide={hide} />}
    </WalletModalContext.Provider>
  );
};

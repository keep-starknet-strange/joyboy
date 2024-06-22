import {createContext, useCallback, useMemo, useState} from 'react';

import {Dialog, DialogProps} from '../components/Dialog';

export type DialogContextType = {
  show: (props: DialogProps) => void;
  hide: () => void;
};

export const DialogContext = createContext<DialogContextType | null>(null);

export const DialogProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [dialog, setDialog] = useState<DialogProps | null>(null);

  const show = useCallback((props: DialogProps) => setDialog(props), []);
  const hide = useCallback(() => setDialog(null), []);

  const context = useMemo(() => ({show, hide}), [show, hide]);

  return (
    <DialogContext.Provider value={context}>
      {children}

      {dialog && <Dialog {...dialog} />}
    </DialogContext.Provider>
  );
};

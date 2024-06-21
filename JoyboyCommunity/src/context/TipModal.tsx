import {NDKEvent} from '@nostr-dev-kit/ndk';
import {createContext, useCallback, useMemo, useRef, useState} from 'react';

import {TipModal} from '../modules/TipModal';

export type TipModalContextType = {
  show: (event: NDKEvent) => void;
};

export const TipModalContext = createContext<TipModalContextType | null>(null);

export const TipModalProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const tipModalRef = useRef<TipModal>(null);
  const [event, setEvent] = useState<NDKEvent | undefined>();

  const show = useCallback((event: NDKEvent) => {
    setEvent(event);
    tipModalRef.current?.open();
  }, []);

  const context = useMemo(() => ({show}), [show]);

  return (
    <TipModalContext.Provider value={context}>
      {children}

      <TipModal event={event} ref={tipModalRef} />
    </TipModalContext.Provider>
  );
};

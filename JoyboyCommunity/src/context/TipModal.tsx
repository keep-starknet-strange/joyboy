import {NDKEvent} from '@nostr-dev-kit/ndk';
import {createContext, useCallback, useMemo, useRef, useState} from 'react';

import {TipModal} from '../modules/TipModal';
import {TipSuccessModal, TipSuccessModalProps} from '../modules/TipSuccessModal';

export type TipModalContextType = {
  show: (event: NDKEvent) => void;
  hide: () => void;

  showSuccess: (props: TipSuccessModalProps) => void;
  hideSuccess: () => void;
  showTipProfile: (userPublicKeyToTip?: string) => void;
};

export const TipModalContext = createContext<TipModalContextType | null>(null);

export const TipModalProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const tipModalRef = useRef<TipModal>(null);

  const [event, setEvent] = useState<NDKEvent | undefined>();
  const [publicKeyToTip, setPublicKeyToTip] = useState<string | undefined>();
  const [successModal, setSuccessModal] = useState<TipSuccessModalProps | null>(null);

  const show = useCallback((event: NDKEvent) => {
    setEvent(event);
    tipModalRef.current?.open();
  }, []);

  const showTipProfile = useCallback((userPublicKey?: string) => {
    setPublicKeyToTip(userPublicKey);
    tipModalRef.current?.open();
  }, []);

  const hide = useCallback(() => {
    tipModalRef.current?.close();
    setEvent(undefined);
  }, []);

  const showSuccess = useCallback((props: TipSuccessModalProps) => {
    setSuccessModal(props);
  }, []);

  const hideSuccess = useCallback(() => {
    setSuccessModal(null);
  }, []);

  const context = useMemo(
    () => ({show, hide, showSuccess, hideSuccess, showTipProfile}),
    [show, hide, showSuccess, hideSuccess, showTipProfile],
  );

  return (
    <TipModalContext.Provider value={context}>
      {children}

      <TipModal
        event={event}
        show={show}
        hide={hide}
        showSuccess={showSuccess}
        hideSuccess={hideSuccess}
        ref={tipModalRef}
        publicKeyToTip={publicKeyToTip}
      />

      {successModal && <TipSuccessModal {...successModal} />}
    </TipModalContext.Provider>
  );
};

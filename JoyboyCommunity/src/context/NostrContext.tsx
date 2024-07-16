import NDK, {NDKPrivateKeySigner} from '@nostr-dev-kit/ndk';
import {createContext, useContext, useEffect, useState} from 'react';

import {useAuth} from '../store/auth';
import {JOYBOY_RELAYS} from '../utils/relay';

export type NostrContextType = {
  ndk: NDK;
};

export const NostrContext = createContext<NostrContextType | null>(null);

export const NostrProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const privateKey = useAuth((state) => state.privateKey);

  const [ndk, setNdk] = useState<NDK>(
    new NDK({
      explicitRelayUrls: JOYBOY_RELAYS,
    }),
  );

  useEffect(() => {
    const newNdk = new NDK({
      explicitRelayUrls: JOYBOY_RELAYS,
      signer: privateKey ? new NDKPrivateKeySigner(privateKey) : undefined,
    });

    newNdk.connect().then(() => {
      setNdk(newNdk);
    });
  }, [privateKey]);

  return <NostrContext.Provider value={{ndk}}>{children}</NostrContext.Provider>;
};

export const useNostrContext = () => {
  const nostr = useContext(NostrContext);

  if (!nostr) {
    throw new Error('NostrContext must be used within a NostrProvider');
  }

  return nostr;
};

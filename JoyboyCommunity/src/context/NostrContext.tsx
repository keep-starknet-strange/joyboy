import NDK, {NDKPrivateKeySigner} from '@nostr-dev-kit/ndk';
import {createContext, useContext, useMemo} from 'react';

import {useAuth} from '../store/auth';
import {JOYBOY_RELAYS} from '../utils/relay';

export type NostrContextType = {
  ndk: NDK;
  relays: string[];
};

export const NostrContext = createContext<NostrContextType | null>(null);

export const NostrProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const privateKey = useAuth((state) => state.privateKey);

  const relays = JOYBOY_RELAYS;
  const ndk = useMemo(() => {
    return new NDK({
      explicitRelayUrls: relays,
      signer: privateKey ? new NDKPrivateKeySigner(privateKey) : undefined,
    });
  }, [relays, privateKey]);

  return <NostrContext.Provider value={{ndk, relays}}>{children}</NostrContext.Provider>;
};

export const useNostrContext = () => {
  const nostr = useContext(NostrContext);

  if (!nostr) {
    throw new Error('NostrContext must be used within a NostrProvider');
  }

  return nostr;
};

import NDK, {NDKNip07Signer} from '@nostr-dev-kit/ndk';
import {SimplePool} from 'nostr-tools';
import {createContext, useContext, useMemo} from 'react';

import {RELAYS_PROD} from '../utils/relay';

export type NostrContextType = {
  pool: SimplePool;
  relays: string[];
  ndk: NDK;
};

export const NostrContext = createContext<NostrContextType | null>(null);

export const NostrProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const pool = useMemo(() => new SimplePool(), []);
  const relays = RELAYS_PROD;

  const ndk = useMemo(() => {
    const nip07signer = new NDKNip07Signer();
    return new NDK({signer: nip07signer});
  }, []);

  return <NostrContext.Provider value={{pool, relays, ndk}}>{children}</NostrContext.Provider>;
};

export const useNostrContext = () => {
  const nostr = useContext(NostrContext);

  if (!nostr) {
    throw new Error('NostrContext must be used within a NostrProvider');
  }

  return nostr;
};

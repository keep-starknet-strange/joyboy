import {SimplePool} from 'nostr-tools';
import {createContext, useContext, useMemo} from 'react';

import {JOYBOY_RELAYS} from '../utils/relay';

export type NostrContextType = {
  pool: SimplePool;
  relays: string[];
};

export const NostrContext = createContext<NostrContextType | null>(null);

export const NostrProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const pool = useMemo(() => new SimplePool(), []);
  const relays = JOYBOY_RELAYS;

  return <NostrContext.Provider value={{pool, relays}}>{children}</NostrContext.Provider>;
};

export const useNostrContext = () => {
  const nostr = useContext(NostrContext);

  if (!nostr) {
    throw new Error('NostrContext must be used within a NostrProvider');
  }

  return nostr;
};

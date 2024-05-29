import NDK, {NDKNip07Signer} from '@nostr-dev-kit/ndk';
import {Relay, SimplePool} from 'nostr-tools';
import {createContext, useContext, useMemo} from 'react';

import {JOYBOY_RELAYS, RELAYS_PROD} from '../utils/relay';

export type NostrContextType = {
  pool: SimplePool;
  relays: string[];
  relayJoyboy?: Relay;
  othersRelays?: string[];
  connectRelayJoyboy: () => Promise<Relay>;
  ndk: NDK;
};

export const NostrContext = createContext<NostrContextType | null>(null);

export const NostrProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const pool = useMemo(() => new SimplePool(), []);
  const relays = JOYBOY_RELAYS;
  const othersRelays = RELAYS_PROD;

  /** This Websocket connection to the Relay  need to be closed after each utilization*/
  const connectRelayJoyboy = async () => {
    const relayJoyboy = await Relay.connect(JOYBOY_RELAYS[0]);
    return relayJoyboy;
  };
  const ndk = useMemo(() => {
    const nip07signer = new NDKNip07Signer();
    return new NDK({signer: nip07signer});
  }, []);

  return (
    <NostrContext.Provider value={{pool, relays, ndk, othersRelays, connectRelayJoyboy}}>
      {children}
    </NostrContext.Provider>
  );
};

export const useNostrContext = () => {
  const nostr = useContext(NostrContext);

  if (!nostr) {
    throw new Error('NostrContext must be used within a NostrProvider');
  }

  return nostr;
};

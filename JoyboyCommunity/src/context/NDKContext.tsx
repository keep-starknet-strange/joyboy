import NDK, {NDKNip07Signer} from '@nostr-dev-kit/ndk';
import {createContext} from 'react';

export const NDKContext = createContext<any>(null);

export default function NDKProvider({children}: {children: React.ReactNode}) {
  const nip07signer = new NDKNip07Signer();
  const ndk = new NDK({signer: nip07signer});
  return <NDKContext.Provider value={ndk}>{children}</NDKContext.Provider>;
}

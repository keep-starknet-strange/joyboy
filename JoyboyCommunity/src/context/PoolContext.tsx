import {SimplePool} from 'nostr-tools';
import {createContext} from 'react';

export const PoolContext = createContext<any>(null);

export default function PoolProvider({children}: {children: React.ReactNode}) {
  const pool = new SimplePool();
  return <PoolContext.Provider value={pool}>{children}</PoolContext.Provider>;
}

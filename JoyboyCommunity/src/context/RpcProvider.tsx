import {createContext} from 'react';
import {RpcProvider} from 'starknet';

export const RpcProviderContext = createContext<RpcProvider | null>(null);

export const RpcProviderProvider: React.FC<React.PropsWithChildren<{provider: RpcProvider}>> = ({
  provider,
  children,
}) => {
  return <RpcProviderContext.Provider value={provider}>{children}</RpcProviderContext.Provider>;
};

import {useContext} from 'react';

import {RpcProviderContext} from '../context/RpcProvider';

export const useRpcProvider = () => {
  const provider = useContext(RpcProviderContext);

  if (!provider) {
    throw new Error('useRpcProvider must be used within a RpcProviderProvider');
  }

  return provider;
};

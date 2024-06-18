import {starknetChainId, useNetwork} from '@starknet-react/core';
import {useMemo} from 'react';

export const useChainId = () => {
  const {chain} = useNetwork();

  return useMemo(() => (chain.id ? starknetChainId(chain.id) : undefined), [chain.id]);
};

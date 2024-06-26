import {useInfiniteQuery} from '@tanstack/react-query';
import {uint256} from 'starknet';

import {ESCROW_ADDRESSES} from '../constants/contracts';
import {EventKey} from '../constants/misc';
import {useAuth} from '../store/auth';
import {useChainId} from './useChainId';
import {useRpcProvider} from './useRpcProvider';

export const useTips = () => {
  const chainId = useChainId();
  const provider = useRpcProvider();
  const {publicKey} = useAuth();

  return useInfiniteQuery({
    initialPageParam: undefined as string | undefined,
    queryKey: ['tips', chainId, publicKey],
    getNextPageParam: (
      lastPage: Awaited<ReturnType<typeof provider.getEvents>>,
      allPages,
      lastPageParam,
    ) => {
      if (!lastPage?.continuation_token) return undefined;

      const pageParam = lastPage.continuation_token;

      if (!pageParam || pageParam === lastPageParam) return undefined;
      return pageParam;
    },
    queryFn: async ({pageParam}) => {
      const {low, high} = uint256.bnToUint256(`0x${publicKey}`);

      const tips = await provider.getEvents({
        address: ESCROW_ADDRESSES[chainId],
        keys: [
          [EventKey.DepositEvent, EventKey.TransferEvent],
          [],
          [],
          [low.toString(), high.toString()],
        ],
        chunk_size: 1000,
        continuation_token: pageParam,
      });

      return tips;
    },
    placeholderData: {pages: [], pageParams: []},
  });
};

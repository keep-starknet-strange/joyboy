import {useInfiniteQuery} from '@tanstack/react-query';

import {ESCROW_ADDRESSES} from '../constants/contracts';
import {EventKey} from '../constants/misc';
import {useChainId} from './useChainId';
import {useRpcProvider} from './useRpcProvider';

export const useTips = () => {
  const chainId = useChainId();
  const provider = useRpcProvider();

  return useInfiniteQuery({
    initialPageParam: undefined as string | undefined,
    queryKey: ['tips', chainId],
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
      const tips = await provider.getEvents({
        address: ESCROW_ADDRESSES[chainId],
        keys: [[EventKey.DepositEvent, EventKey.TransferEvent]],
        chunk_size: 1000,
        continuation_token: pageParam,
      });

      return tips;
    },
    placeholderData: {pages: [], pageParams: []},
  });
};

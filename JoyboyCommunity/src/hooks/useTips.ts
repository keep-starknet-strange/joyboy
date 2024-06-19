import {NDKEvent, NDKKind} from '@nostr-dev-kit/ndk';
import {useInfiniteQuery} from '@tanstack/react-query';

import {useNostrContext} from '../context/NostrContext';

export type UseTipsOptions = {
  authors?: string[];
  search?: string;
};

export const useTips = (options?: UseTipsOptions) => {
  const {ndk} = useNostrContext();

  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['tips', options?.authors, options?.search],
    getNextPageParam: (lastPage: NDKEvent[], allPages, lastPageParam) => {
      if (!lastPage?.length) return undefined;

      const pageParam = lastPage[lastPage.length - 1].created_at;

      if (!pageParam || pageParam === lastPageParam) return undefined;
      return pageParam;
    },
    queryFn: async ({pageParam}) => {
      const tips = await ndk.fetchEvents({
        kinds: [NDKKind.Text],
        '#type': ['tip'],
        authors: options?.authors,
        search: options?.search,
        until: pageParam || Math.round(Date.now() / 1000),
        limit: 20,
      });

      // Only return tips with deposit_id tag
      return [...tips].filter((tip) => tip.tags.some((tag) => tag[0] === 'deposit_id'));
    },
    placeholderData: {pages: [], pageParams: []},
  });
};

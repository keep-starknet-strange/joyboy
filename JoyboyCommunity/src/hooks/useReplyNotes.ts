import {NDKKind} from '@nostr-dev-kit/ndk';
import {useInfiniteQuery} from '@tanstack/react-query';

import {useNostrContext} from '../context/NostrContext';

export type UseReplyNotesOptions = {
  noteId?: string;
  authors?: string[];
  search?: string;
};

export const useReplyNotes = (options?: UseReplyNotesOptions) => {
  const {ndk} = useNostrContext();

  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['replyNotes', options?.noteId, options?.authors, options?.search],
    getNextPageParam: (lastPage: any, allPages, lastPageParam) => {
      if (!lastPage?.length) return undefined;

      const pageParam = lastPage[lastPage.length - 1].created_at;

      if (!pageParam || pageParam === lastPageParam) return undefined;
      return pageParam;
    },
    queryFn: async ({pageParam}) => {
      const notes = await ndk.fetchEvents({
        kinds: [NDKKind.Text],
        authors: options?.authors,
        search: options?.search,
        until: pageParam || Math.round(Date.now() / 1000),
        limit: 20,

        '#e': options?.noteId ? [options.noteId] : undefined,
      });

      return [...notes].filter((note) => note.tags.every((tag) => tag[0] === 'e'));
    },
    placeholderData: {pages: [], pageParams: []},
  });
};

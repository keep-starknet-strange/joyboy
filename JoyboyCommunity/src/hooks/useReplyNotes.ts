import {useInfiniteQuery} from '@tanstack/react-query';

import {useNostrContext} from '../context/NostrContext';
import {EventKind} from '../types';

export type UseNotesOptions = {
  noteId?: string;
  authors?: string[];
  search?: string;
};

export const useReplyNotes = (options?: UseNotesOptions) => {
  const {pool, othersRelays} = useNostrContext();

  return useInfiniteQuery({
    initialPageParam: Math.round(Date.now() / 1000),
    queryKey: ['notes', options?.noteId, options?.authors, options?.search],
    getNextPageParam: (lastPage: any, allPages, lastPageParam) => {
      if (!lastPage?.length) return undefined;

      const pageParam = lastPage[lastPage.length - 1].created_at;

      if (!pageParam || pageParam === lastPageParam) return undefined;
      return pageParam;
    },
    queryFn: async ({pageParam}) => {
      const notes = await pool.querySync(othersRelays, {
        kinds: [EventKind.Note],
        authors: options?.authors,
        search: options?.search,
        until: pageParam,
        limit: 20,

        '#e': options?.noteId ? [options.noteId] : undefined,
      });

      return notes.filter((note) => note.tags.every((tag) => tag[0] === 'e'));
    },
    placeholderData: {pages: [], pageParams: []},
  });
};

import {NDKKind} from '@nostr-dev-kit/ndk';
import {useQuery} from '@tanstack/react-query';

import {useNostrContext} from '../../context/NostrContext';

export type UseReactionsOptions = {
  authors?: string[];
  search?: string;
  noteId?: string;
};

export const useReactions = (options?: UseReactionsOptions) => {
  const {ndk} = useNostrContext();

  return useQuery({
    queryKey: ['reactions', ndk, options?.noteId, options?.authors, options?.search],
    queryFn: async () => {
      const notes = await ndk.fetchEvents({
        kinds: [NDKKind.Reaction],
        authors: options?.authors,
        search: options?.search,

        '#e': options?.noteId ? [options.noteId] : undefined,
      });

      return [...notes];
    },
    placeholderData: [],
  });
};

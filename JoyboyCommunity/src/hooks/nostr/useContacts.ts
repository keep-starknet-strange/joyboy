import {NDKKind} from '@nostr-dev-kit/ndk';
import {useQuery} from '@tanstack/react-query';

import {useNostrContext} from '../../context/NostrContext';

export type UseContactsOptions = {
  authors?: string[];
  search?: string;
};

export const useContacts = (options?: UseContactsOptions) => {
  const {ndk} = useNostrContext();

  return useQuery({
    queryKey: ['contacts', ndk, options?.authors, options?.search],
    queryFn: async () => {
      const contacts = await ndk.fetchEvent({
        kinds: [NDKKind.Contacts],
        authors: options?.authors,
        search: options?.search,
      });

      return contacts?.tags.filter((tag) => tag[0] === 'p').map((tag) => tag[1]) ?? [];
    },
    placeholderData: [],
  });
};

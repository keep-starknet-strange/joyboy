import {useQuery} from '@tanstack/react-query';

import {useNostrContext} from '../context/NostrContext';
import {EventKind} from '../types';

export type UseProfileOptions = {
  publicKey: string;
};

export const useProfile = (options: UseProfileOptions) => {
  const {pool, relays} = useNostrContext();

  return useQuery({
    queryKey: ['profile', options.publicKey],
    queryFn: async () => {
      const profileEvent = await pool.get(relays, {
        kinds: [EventKind.Metadata],
        authors: [options.publicKey],
      });

      console.log('profileEvent', profileEvent);

      const profile = JSON.parse(profileEvent.content) as Record<string, string | undefined>;

      return {
        username: profile.name,
        displayName: profile.display_name ?? profile.displayName,
        website: profile.website,
        banner: profile.banner,
        about: profile.about,
        picture: profile.picture,
      };
    },
    placeholderData: {} as any,
  });
};

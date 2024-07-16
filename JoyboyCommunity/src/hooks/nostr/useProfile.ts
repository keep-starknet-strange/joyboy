import {useQuery} from '@tanstack/react-query';

import {useNostrContext} from '../../context/NostrContext';

export type UseProfileOptions = {
  publicKey?: string;
};

export const useProfile = (options: UseProfileOptions) => {
  const {ndk} = useNostrContext();

  return useQuery({
    queryKey: ['profile', options.publicKey],
    queryFn: async () => {
      const user = ndk.getUser({pubkey: options.publicKey});

      const result = Promise.race([
        user.fetchProfile(),
        new Promise((_, reject) => setTimeout(() => reject(), 3_000)),
      ]);

      return result;
    },
    placeholderData: {} as any,
  });
};

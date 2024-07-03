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

      return user.fetchProfile();
    },
    placeholderData: {} as any,
  });
};

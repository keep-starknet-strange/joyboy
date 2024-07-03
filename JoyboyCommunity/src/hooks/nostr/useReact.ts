import {NDKEvent, NDKKind} from '@nostr-dev-kit/ndk';
import {useMutation} from '@tanstack/react-query';

import {useNostrContext} from '../../context/NostrContext';

export const useReact = () => {
  const {ndk} = useNostrContext();

  return useMutation({
    mutationKey: ['react'],
    mutationFn: async (data: {event: NDKEvent; type: 'like' | 'dislike'}) => {
      const event = new NDKEvent(ndk);
      event.kind = NDKKind.Reaction;
      event.content = data.type === 'like' ? '+' : '-';
      event.tags = [
        ['e', data.event.id],
        ['p', data.event.pubkey],
        ['k', (data.event.kind ?? 1).toString()],
      ];

      return event.publish();
    },
  });
};

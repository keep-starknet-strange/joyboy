import {NDKEvent, NDKKind} from '@nostr-dev-kit/ndk';
import {useMutation} from '@tanstack/react-query';

import {useNostrContext} from '../../context/NostrContext';

export const useSendNote = () => {
  const {ndk} = useNostrContext();

  return useMutation({
    mutationKey: ['sendNote', ndk],
    mutationFn: async (data: {content: string; tags?: string[][]}) => {
      const event = new NDKEvent(ndk);
      event.kind = NDKKind.Text;
      event.content = data.content;
      event.tags = data.tags ?? [];

      return event.publish();
    },
  });
};

import {NDKEvent, NDKPrivateKeySigner} from '@nostr-dev-kit/ndk';
import {useMutation} from '@tanstack/react-query';

import {useNostrContext} from '../context/NostrContext';
import {useAuth} from '../store/auth';

/** Check if a note is valid and publish not on relayer if event valid */
export const useSendNote = () => {
  const {ndk} = useNostrContext();
  const {privateKey} = useAuth();
  const privateKeyString = Buffer.from(privateKey).toString('hex');

  return useMutation({
    mutationFn: async (data: {content: string; tags?: string[][]}) => {
      if (!privateKeyString) {
        throw new Error('Private key is required');
      }

      const signer = new NDKPrivateKeySigner(privateKeyString);

      const event = new NDKEvent(ndk);
      event.content = data.content;
      event.tags = data.tags ?? [];
      event.sig = await event.sign(signer);

      return event.publish();
    },
  });
};

import {NDKEvent, NDKKind} from '@nostr-dev-kit/ndk';
import {useMutation} from '@tanstack/react-query';

import {useNostrContext} from '../../context/NostrContext';
import {useAuth} from '../../store/auth';

export const useEditContacts = () => {
  const {ndk} = useNostrContext();
  const {publicKey} = useAuth();

  return useMutation({
    mutationKey: ['editContacts', ndk],
    mutationFn: async (data: {pubkey: string; type: 'add' | 'remove'}) => {
      let contacts = await ndk.fetchEvent({
        kinds: [NDKKind.Contacts],
        authors: [publicKey],
      });

      if (!contacts) {
        contacts = new NDKEvent(ndk);
        contacts.kind = NDKKind.Contacts;
        contacts.content = '';
        contacts.tags = [];
      }

      if (data.type === 'add') {
        contacts.tags.push(['p', data.pubkey, '', '']);
      } else {
        contacts.tags = contacts.tags.filter((tag) => tag[1] !== data.pubkey);
      }

      return contacts.publish();
    },
  });
};

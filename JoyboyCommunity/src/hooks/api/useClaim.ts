import {NostrEvent} from '@nostr-dev-kit/ndk';

import {ApiInstance} from '../../services/api';
import {useApiMutation} from './useApiMutation';

export const useClaim = () => {
  return useApiMutation({
    mutationKey: ['claim'],
    mutationFn: (event: NostrEvent) => {
      return ApiInstance.post('/deposit/claim', {event});
    },
  });
};

import {NostrEvent} from '@nostr-dev-kit/ndk';

import {ApiInstance} from '../../services/api';
import {useApiMutation} from './useApiMutation';

export const useEstimateClaim = () => {
  return useApiMutation({
    mutationKey: ['estimateClaim'],
    mutationFn: (event: NostrEvent) => {
      return ApiInstance.post('/deposit/estimate-claim', {event});
    },
  });
};

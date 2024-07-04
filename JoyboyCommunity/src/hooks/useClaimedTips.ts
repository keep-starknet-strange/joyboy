import {useQuery} from '@tanstack/react-query';
import {uint256} from 'starknet';

import {ESCROW_ADDRESSES} from '../constants/contracts';
import {CHAIN_ID} from '../constants/env';
import {EventKey} from '../constants/misc';
import {useAuth} from '../store/auth';
import {parseClaimEvent} from '../utils/events';
import {useRpcProvider} from './useRpcProvider';

export const useClaimedTips = () => {
  const provider = useRpcProvider();
  const {publicKey} = useAuth();

  return useQuery({
    queryKey: ['claimedTips', CHAIN_ID, publicKey],
    queryFn: async () => {
      const {low, high} = uint256.bnToUint256(
        `0x468a2f6cc62ec21540165fa061ba17a7067a4c28f4aa02a44781c24acb720440`,
      );

      const getEvents = async (
        continuationToken?: string,
      ): Promise<Awaited<ReturnType<typeof provider.getEvents>>['events']> => {
        const tips = await provider.getEvents({
          address: ESCROW_ADDRESSES[CHAIN_ID],
          keys: [[EventKey.ClaimEvent], [], [], [low.toString()], [high.toString()]],
          to_block: 'pending',
          chunk_size: 1000,
          continuation_token: continuationToken,
        });

        if (tips.continuation_token) {
          const next = await getEvents(tips.continuation_token);
          return [...tips.events, ...next];
        }

        return tips.events;
      };

      const events = await getEvents();

      return events
        .map((event) => parseClaimEvent(event))
        .filter((event): event is NonNullable<ReturnType<typeof parseClaimEvent>> => !!event);
    },
    placeholderData: [],
  });
};

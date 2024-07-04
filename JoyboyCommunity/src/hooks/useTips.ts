import {useQuery} from '@tanstack/react-query';
import {uint256} from 'starknet';

import {ESCROW_ADDRESSES} from '../constants/contracts';
import {CHAIN_ID} from '../constants/env';
import {EventKey} from '../constants/misc';
import {useAuth} from '../store/auth';
import {parseClaimEvent, parseDepositEvent} from '../utils/events';
import {useRpcProvider} from './useRpcProvider';

export const useTips = () => {
  const provider = useRpcProvider();
  const {publicKey} = useAuth();

  return useQuery({
    queryKey: ['tips', CHAIN_ID, publicKey],
    queryFn: async () => {
      if (!publicKey) return [];

      const {low, high} = uint256.bnToUint256(`0x${publicKey}`);

      const getTipEvents = async (
        continuationToken?: string,
      ): Promise<Awaited<ReturnType<typeof provider.getEvents>>['events']> => {
        const tips = await provider.getEvents({
          address: ESCROW_ADDRESSES[CHAIN_ID],
          keys: [
            [EventKey.DepositEvent, EventKey.TransferEvent],
            [],
            [],
            [low.toString(), high.toString()],
          ],
          to_block: 'pending',
          chunk_size: 1000,
          continuation_token: continuationToken,
        });

        if (tips.continuation_token) {
          const next = await getTipEvents(tips.continuation_token);
          return [...tips.events, ...next];
        }

        return tips.events;
      };

      const tipEvents = (await getTipEvents())
        .map((event) => parseDepositEvent(event))
        .filter((event): event is NonNullable<ReturnType<typeof parseDepositEvent>> => !!event);

      const getClaimEvents = async (
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
          const next = await getClaimEvents(tips.continuation_token);
          return [...tips.events, ...next];
        }

        return tips.events;
      };

      const claimEvents = (await getClaimEvents())
        .map((event) => parseClaimEvent(event))
        .filter((event): event is NonNullable<ReturnType<typeof parseClaimEvent>> => !!event);

      return tipEvents.map((tip) => ({
        ...tip,
        claimed: claimEvents.findIndex((claim) => claim.depositId === tip.depositId) !== -1,
      }));
    },
    placeholderData: [],
  });
};

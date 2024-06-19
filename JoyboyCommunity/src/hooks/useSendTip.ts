import {NDKEvent, NDKKind} from '@nostr-dev-kit/ndk';
import {useMutation} from '@tanstack/react-query';

import {TokenSymbol} from '../constants/tokens';
import {useNostrContext} from '../context/NostrContext';

export const useSendTip = () => {
  const {ndk} = useNostrContext();

  return useMutation({
    mutationKey: ['sendTip'],
    mutationFn: async (data: {
      content: string;
      depositId: number;
      recipient: string;
      symbol: TokenSymbol;
      amount: number;
    }) => {
      const event = new NDKEvent(ndk);
      event.kind = NDKKind.Text;
      event.content = data.content;
      event.tags = [
        ['type', 'tip'],
        ['deposit_id', data.depositId.toString()],
        ['pubkey', data.recipient],
        ['symbol', data.symbol],
        ['amount', data.amount.toString()],
      ];

      return event.publish();
    },
  });
};

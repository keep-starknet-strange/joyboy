import {Event as EventsNostr} from 'nostr-tools';

/** @TODO optimization of the filter and search string[][]
 *  add NIP-10 filter
 * filter for tags :
 * ["e", "note_pubkey", "relay_url", "marker as reply | root | mention", "pubkey_author"]
 * ["p", "id_note","p1_note_reply"]
 *
 * https://github.com/nostr-protocol/nips/blob/master/10.md
 */
export const filterRepliesOnEvents = (events: EventsNostr[]) => {
  try {
    const repliesFilter = [];
    const replies = events?.filter((e) => {
      if (e?.kind == 1 && e?.tags?.length > 0) {
        e?.tags?.find((a, i) => {
          // @TODO add check pubkey address
          // we can also check here if we want a[3] == "reply" || a[3] == "root"
          if (
            a?.includes('e')
            // && a[1] && a[1]?.length == 64
          ) {
            repliesFilter?.push(e);
            return e;
          }
        });
      }
    });
    return repliesFilter;
  } catch (e) {
    return [];
  }
};

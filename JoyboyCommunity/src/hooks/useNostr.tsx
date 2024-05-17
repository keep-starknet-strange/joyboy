import {
  NostrEvent,
  SimplePool,
  VerifiedEvent,
  finalizeEvent,
  nip05,
  parseReferences,
  verifyEvent,
} from "nostr-tools";
import { useMemo, useState } from "react";
import { generateSecretKey, getPublicKey } from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"; // already an installed dependency
import NDK, { NDKEvent, NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { RELAYS_PROD } from "../utils/relay";
import { queryProfile } from "nostr-tools/lib/types/nip05";

export const useNostr = () => {
  const pool = new SimplePool();
  const relays = RELAYS_PROD;
  const nip07signer = new NDKNip07Signer();
  const ndk = new NDK({ signer: nip07signer });

  const [eventsData, setEventsData] = useState<NostrEvent[]>([]);

  /** fix memo reload */
  const events = useMemo(() => {
    return eventsData;
  }, [eventsData]);
  const [eventsUser, setEventsUser] = useState<NostrEvent[]>([]);
  const [isReady, setIsReady] = useState(false);

  const generateKeypair = () => {
    let sk = generateSecretKey();
    let pk = getPublicKey(sk);
    return {
      pk: pk,
      sk: sk,
    };
  };

  const setEvents = (eventsData?: NostrEvent[]) => {
    setEventsData(eventsData);
  };

  const getEvents = async (isSetEvents?: boolean) => {
    let events = await pool.querySync(relays, { kinds: [0, 1] }, {});
    if (isSetEvents) {
      setEventsData(events);
    }
    return events;
  };

  const getEventsNotes = async (isSetEvents?: boolean) => {
    let eventsNotes = await pool.querySync(relays, { kinds: [1] });
    if (isSetEvents) {
      setEventsData(eventsNotes);
    }
    return eventsNotes;
  };

  const getEventsUser = async (isSetEvents?: boolean) => {
    let eventsUser = await pool.querySync(relays, { kinds: [0] });
    if (isSetEvents) {
      setEventsUser(eventsUser);
    }
    return eventsUser;
  };

  const parsingEventContent = (event?: NostrEvent) => {
    try {
      let references = parseReferences(event);
      let simpleAugmentedContent = event.content;

      let profilesCache;
      let eventsCache;
      for (let i = 0; i < references.length; i++) {
        let { text, profile, event, address } = references[i];
        let augmentedReference = profile ? (
          <strong>@${profilesCache[profile.pubkey].name}</strong>
        ) : event ? (
          <em>${eventsCache[event.id].content.slice(0, 5)}</em>
        ) : address ? (
          <a href="${text}">[link]</a>
        ) : (
          text
        );
        // simpleAugmentedContent.replaceAll(text, augmentedReference);
        simpleAugmentedContent.replaceAll(text, augmentedReference?.toString());
      }

      return simpleAugmentedContent;
    } catch (e) {}
  };

  /** @TODO finish Give NIP05 parsed content */
  const parsingNip05EventContent = (event?: NostrEvent) => {
    try {
      let references = parseReferences(event);
      let simpleAugmentedContent = event.content;
      let profilesCache;
      let stringify = JSON.parse(simpleAugmentedContent);
      return stringify;
    } catch (e) {}
  };

  const getEvent = async (id: string) => {
    try {
      let event = await pool.get(relays, {
        ids: [id],
      });
      return event;
    } catch (e) {}
  };

  const getUser = async (pubkey: string, isSetEvents?: boolean) => {
    try {
      let user = await ndk.getUser({
        pubkey: pubkey,
      });
      // return await queryProfile(id);
      return user;
    } catch (e) {
      console.log("error getUser", e);
    }
  };

  const getEventsNotesFromPubkey = async (
    pubkey: string,
    relaysUser?: string[],
    isSetEvents?: boolean
  ) => {
    try {
      let events = await pool.querySync(relaysUser ?? relays, {
        kinds: [1],
        authors: [pubkey],
      });
      if (isSetEvents) {
        setEventsData(events);
      }
      return events;
    } catch (e) {
      console.log("error getUser", e);
    }
  };

  const sendNote = (
    sk: Uint8Array,
    content: string,
    tags?: string[][]
  ): {
    event?: VerifiedEvent;
    isValid?: boolean;
  } => {
    try {
      let event = finalizeEvent(
        {
          kind: 1,
          created_at: Math.floor(Date.now() / 1000),
          tags: tags ?? [],
          content: content,
        },
        sk
      );
      console.log("event", event);

      let isGood = verifyEvent(event);

      if (isGood) {
        return {
          event,
          isValid: true,
        };
      } else {
        return {
          event,
          isValid: false,
        };
      }
    } catch (e) {
      console.log("issue sendNote", e);
      return {
        event: undefined,
        isValid: false,
      };
    }
  };

  return {
    pool,
    getEvents,
    getEvent,
    parseReferences,
    setEvents,
    events,
    parsingEventContent,
    getEventsNotes,
    getEventsUser,
    relays,
    eventsData,
    parsingNip05EventContent,
    getUser,
    generateKeypair,
    getEventsNotesFromPubkey,
    sendNote,
  };
};

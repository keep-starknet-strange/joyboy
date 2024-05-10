import { NostrEvent, SimplePool, nip05, parseReferences } from "nostr-tools";
import { useMemo, useState } from "react";

export const useNostr = () => {
  const pool = new SimplePool();
  const relays = ["wss://relay.n057r.club", "wss://relay.nostr.net"];
  
  const [eventsData, setEventsData] = useState<NostrEvent[]>([]);
  const [eventsUser, setEventsUser] = useState<NostrEvent[]>([]);
  const [isReady, setIsReady] = useState(false);

  const events = useMemo(() => {
    return eventsData;
  }, [eventsData]);

  const setEvents = (eventsData?: NostrEvent[]) => {
    setEventsData(eventsData);
  };

  const getEvents = async (isSetEvents?:boolean) => {
    let events = await pool.querySync(relays, { kinds: [0, 1] }, {});
    if(isSetEvents) {
      setEventsData(events)
    }
    return events;
  };

  const getEventsPost = async (isSetEvents?:boolean) => {
    let eventsNotes = await pool.querySync(relays, { kinds: [1] });
    if(isSetEvents) {
      setEventsData(eventsNotes)
    }
    return eventsNotes;
  };

  const getEventsUser = async (isSetEvents?:boolean) => {
    let eventsUser = await pool.querySync(relays, { kinds: [0] });
    if(isSetEvents) {
      setEventsUser(eventsUser)
    }
    return eventsUser;
  };

  const parsingEventContent = (event?: NostrEvent) => {
    let references = parseReferences(event);
    let simpleAugmentedContent = event.content;

    let profilesCache;
    let eventsCache;
    for (let i = 0; i < references.length; i++) {
      let { text, profile, event, address } = references[i];
      let augmentedReference = profile
        ? `<strong>@${profilesCache[profile.pubkey].name}</strong>`
        : event
        ? `<em>${eventsCache[event.id].content.slice(0, 5)}</em>`
        : address
        ? `<a href="${text}">[link]</a>`
        : text;
      simpleAugmentedContent.replaceAll(text, augmentedReference);
    }

    return simpleAugmentedContent;
  };

  /** @TODO finish Give NIP05 parsed content */
  const parsingNip05EventContent = (event?: NostrEvent)=> {
    let references = parseReferences(event);
    let simpleAugmentedContent = event.content;
    let profilesCache;
    let stringify = JSON.parse(simpleAugmentedContent)
    return stringify;
  };

  const getEvent = async (id: string) => {
    let event = await pool.get(relays, {
      ids: [id],
    });
    return event;
  };

  return {
    pool,
    getEvents,
    getEvent,
    parseReferences,
    setEvents,
    events,
    parsingEventContent,
    getEventsPost,
    getEventsUser,
    relays,
    eventsData,
    parsingNip05EventContent
  };
};

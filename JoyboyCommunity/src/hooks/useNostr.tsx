import { NostrEvent, SimplePool, parseReferences } from "nostr-tools";
import { useState } from "react";

export const useNostr = () => {
  const pool = new SimplePool();
  const [events, setEventsData] = useState<NostrEvent[]>([]);
  const relays = ["wss://relay.n057r.club", "wss://relay.nostr.net"];

  const setEvents = (eventsData?: NostrEvent[]) => {
    setEventsData(eventsData);
    console.log("events", events);
  };

  const getEvents = async () => {
    let events = await pool.querySync(relays, { kinds: [0, 1] }, {});
    return events;
  };

  const getEventsPost = async () => {
    let eventsNotes = await pool.querySync(relays, { kinds: [1] });
    return eventsNotes;
  };

  const getEventsUser = async () => {
    let eventsUser = await pool.querySync(relays, { kinds: [0] });
    return eventsUser;
  };

  const parsingEvent = (event?: NostrEvent) => {
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
  };

  const getEvent = async (id: string) => {
    let event = await pool.get(relays, {
      ids: [id],
    });
    console.log("getEvent", event);
    return event;
  };

  return {
    pool,
    getEvents,
    getEvent,
    parseReferences,
    setEvents,
    events,
    parsingEvent,
    getEventsPost,
    getEventsUser,
    relays
  };
};

import {Event as EventNostr, Filter} from 'nostr-tools';

export * from './post';
export * from './routes';

export interface INoteRepostParsed {
  event?: EventNostr;
  repost?: EventNostr;
}

export interface IPostNote {
  id?: string;
  content?: string;
  author?: string;
  source?: string;
  image?: string;
}

export interface IProfileNostr {
  handle?: string;
  pubkey?: string;
  description?: string;
  source?: string;
}

export interface NIP05Content {
  nip05?: string;
  lud16?: string;
  name?: string;
  picture?: string;
  about?: string;
  website?: string;
  lud06?: string;
  display_name?: string;
  npub?: string;
  created_at?: string;
}

export interface IUserEvent {
  about?: string;
  display_name?: string;
  lud16?: string;
  website?: string;
  picture?: string;
  nip05?: string;
  banner?: string;
  name?: string;
}

export interface IPoolEventsFromPubkey {
  pubkey: string;
  relaysUser?: string[];
  kinds: number[];
}

export interface IPoolEventsByQuery {
  ids: string[];
  filter?: Filter;
  relaysProps?: string[];
}

export interface IUserQuery {
  pubkey: string;
  id?: string;
}

export interface ISendNotePayload {
  sk: Uint8Array;
  content: string;
  tags?: string[][];
}

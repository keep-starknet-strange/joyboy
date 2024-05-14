export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Profile: undefined;
  Create: undefined;
  Note: undefined;
  Sign: undefined;
  Login: undefined;
  NoteDetailScreen: { noteId: string };
  UserDetailScreen: { userId: string };
};


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
  nip05?:string;
  lud16?:string;
  name?:string;
  picture?:string;
  about?:string;
  website?:string;
  lud06?:string;
  display_name?:string;
  npub?:string;
  created_at?:string;
}
export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Profile: undefined;
  Create: undefined;
  Note: undefined;
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

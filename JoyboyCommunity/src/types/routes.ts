import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {Event as EventNostr} from 'nostr-tools';

import {Post} from './post';

export type RootStackParams = {
  Home: NavigatorScreenParams<HomeStackParams>;
  CreatePost: undefined;
  Profile: {publicKey: string};
  NoteDetail: {noteId: string};
  PostDetails: {
    post: Post;
    event: EventNostr;
    repostedEvent: EventNostr;
    sourceUser?: string;
  };

  Loading: undefined;

  Login: undefined;
};

export type HomeStackParams = {
  Feed: undefined;
  UserProfile: {publicKey: string};
  Notifications: undefined;
};

// Root Stack
export type RootStackNavigationProps = NativeStackNavigationProp<RootStackParams>;
export type RootStackScreenProps = NativeStackScreenProps<RootStackParams>;

export type RootStackHomeNavigationProps = NativeStackNavigationProp<RootStackParams, 'Home'>;
export type RootStackHomeScreenProps = NativeStackScreenProps<RootStackParams, 'Home'>;

export type RootStackCreatePostNavigationProps = NativeStackNavigationProp<
  RootStackParams,
  'CreatePost'
>;
export type RootStackCreatePostScreenProps = NativeStackScreenProps<RootStackParams, 'CreatePost'>;

export type RootStackProfileNavigationProps = NativeStackNavigationProp<RootStackParams, 'Profile'>;
export type RootStackProfileScreenProps = NativeStackScreenProps<RootStackParams, 'Profile'>;

export type RootStackNoteDetailNavigationProps = NativeStackNavigationProp<
  RootStackParams,
  'NoteDetail'
>;
export type RootStackNoteDetailScreenProps = NativeStackScreenProps<RootStackParams, 'NoteDetail'>;

export type RootStackLoadingNavigationProps = NativeStackNavigationProp<RootStackParams, 'Loading'>;
export type RootStackLoadingScreenProps = NativeStackScreenProps<RootStackParams, 'Loading'>;

// Home Stack
export type HomeNavigationProp = NativeStackNavigationProp<HomeStackParams>;

export type FeedScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParams, 'Feed'>,
  NativeStackScreenProps<RootStackParams>
>;
export type UserProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParams, 'UserProfile'>,
  NativeStackScreenProps<RootStackParams>
>;

export type NotificationsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParams, 'Notifications'>,
  NativeStackScreenProps<RootStackParams>
>;

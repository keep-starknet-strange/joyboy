import {NDKEvent} from '@nostr-dev-kit/ndk';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParams = {
  MainStack: NavigatorScreenParams<MainStackParams>;
  AuthStack: NavigatorScreenParams<AuthStackParams>;
};

export type AuthStackParams = {
  Login: undefined;
  CreateAccount: undefined;
  SaveKeys: {
    privateKey: string;
    publicKey: string;
  };
};

export type MainStackParams = {
  Home: NavigatorScreenParams<HomeBottomStackParams>;
  CreatePost: undefined;
  Profile: {publicKey: string};
  PostDetail: {postId: string; post?: NDKEvent};
};

export type HomeBottomStackParams = {
  Feed: undefined;
  UserProfile: {publicKey: string};
  Notifications: undefined;
  Messages: undefined;
};

// Root Stack
export type RootStackNavigationProps = NativeStackNavigationProp<RootStackParams>;
export type RootStackScreenProps = NativeStackScreenProps<RootStackParams>;

// Auth
export type AuthLoginScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParams, 'Login'>,
  NativeStackScreenProps<RootStackParams>
>;
export type AuthCreateAccountScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParams, 'CreateAccount'>,
  NativeStackScreenProps<RootStackParams>
>;
export type AuthSaveKeysScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParams, 'SaveKeys'>,
  NativeStackScreenProps<RootStackParams>
>;

// Home Stack
export type HomeNavigationProp = NativeStackNavigationProp<HomeBottomStackParams>;

export type FeedScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeBottomStackParams, 'Feed'>,
  NativeStackScreenProps<RootStackParams>
>;
export type UserProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeBottomStackParams, 'UserProfile'>,
  NativeStackScreenProps<RootStackParams>
>;

export type NotificationsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeBottomStackParams, 'Notifications'>,
  NativeStackScreenProps<RootStackParams>
>;

export type MessagesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeBottomStackParams, 'Messages'>,
  NativeStackScreenProps<RootStackParams>
>;

// Main Stack
export type MainStackNavigationProps = NativeStackNavigationProp<MainStackParams>;

export type CreatePostScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'CreatePost'>,
  NativeStackScreenProps<RootStackParams>
>;

export type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'Profile'>,
  NativeStackScreenProps<RootStackParams>
>;

export type PostDetailScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'PostDetail'>,
  NativeStackScreenProps<RootStackParams>
>;

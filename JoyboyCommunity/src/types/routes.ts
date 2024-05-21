import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type RootStackParams = {
  Home: NavigatorScreenParams<HomeStackParams>;
  CreatePost: undefined;
  UserDetail: { userId?: string };

  Loading: undefined;

  Login: undefined;
};

export type HomeStackParams = {
  Feed: undefined;
  Profile: undefined;
  Notifications: undefined;
};

// Root Stack
export type RootStackNavigationProps =
  NativeStackNavigationProp<RootStackParams>;
export type RootStackScreenProps = NativeStackScreenProps<RootStackParams>;

export type RootStackHomeNavigationProps = NativeStackNavigationProp<
  RootStackParams,
  "Home"
>;
export type RootStackHomeScreenProps = NativeStackScreenProps<
  RootStackParams,
  "Home"
>;

export type RootStackCreatePostNavigationProps = NativeStackNavigationProp<
  RootStackParams,
  "CreatePost"
>;
export type RootStackCreatePostScreenProps = NativeStackScreenProps<
  RootStackParams,
  "CreatePost"
>;

export type RootStackUserDetailNavigationProps = NativeStackNavigationProp<
  RootStackParams,
  "UserDetail"
>;
export type RootStackUserDetailScreenProps = NativeStackScreenProps<
  RootStackParams,
  "UserDetail"
>;

export type RootStackLoadingNavigationProps = NativeStackNavigationProp<
  RootStackParams,
  "Loading"
>;
export type RootStackLoadingScreenProps = NativeStackScreenProps<
  RootStackParams,
  "Loading"
>;

// Home Stack
export type HomeNavigationProp = NativeStackNavigationProp<HomeStackParams>;

export type FeedScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParams, "Feed">,
  NativeStackScreenProps<RootStackParams>
>;
export type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParams, "Profile">,
  NativeStackScreenProps<RootStackParams>
>;

export type NotificationsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParams, "Notifications">,
  NativeStackScreenProps<RootStackParams>
>;

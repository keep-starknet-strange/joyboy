import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
  Platform,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { INoteRepostParsed, IUserEvent, RootStackParamList } from "../types";
import { useNostr } from "../hooks/useNostr";
import { Event as EventNostr } from "nostr-tools";
import styled, { useTheme } from "styled-components";
import Typography from "../components/typography";
import { SceneMap, TabView } from "react-native-tab-view";
import Post from "../shared/components/Post";
import Divider from "../components/divider/Divider";
import { NDKUser } from "@nostr-dev-kit/ndk";
import { filterRepliesOnEvents } from "../utils/filter";
type UserDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "UserDetailScreen"
>;

type UserDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserDetailScreen"
>;

type Props = {
  route: UserDetailScreenRouteProp;
  navigationProps: UserDetailScreenNavigationProp;
  userId?: string;
};

/** @TODO fetch user */
const UserDetailScreen: React.FC<Props> = ({ route, userId }) => {
  const { getEvent, getUser, getEventsNotesFromPubkey, getUserQuery } =
    useNostr();

  const { userId: userQuery } = route.params;
  const [eventProfile, setEventProfile] = useState<NDKUser | undefined>();
  const [eventsTool, setEventsTool] = useState<EventNostr[] | undefined>();
  const [events, setEvents] = useState<EventNostr[] | undefined>();
  const [replies, setReplies] = useState<EventNostr[] | undefined>();
  const [reposts, setReposts] = useState<INoteRepostParsed[] | undefined>();
  const [reactions, setReactions] = useState<EventNostr[] | undefined>();
  const [imgUser, setImageUser] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const [isFirstLoadDone, setIsFirstLoadDone] = useState<boolean | undefined>(
    false
  );
  const [profile, setProfile] = useState<IUserEvent | undefined>();
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);
  const [contentParsed, setContentParsed] = useState<string | undefined>();
  // const layout = useWindowDimensions();
  // const theme = useTheme();
  const [routes] = React.useState([
    { key: "posts", title: "Posts" },
    { key: "replies", title: "Replies" },
    { key: "reactions", title: "Reactions" },
    { key: "reposts", title: "Reposts" },
  ]);

  // Fetch user based on userId pubkey
  useEffect(() => {
    if (!eventProfile && userQuery && !isLoading) {
      handleGetUserEventById();
    }
  }, [eventProfile, userId, userQuery, isLoading]);
  const handleGetUserEventById = async () => {
    try {
      console.log("handleGetEventById try get event");
      if (isLoading || (profile || isFirstLoadDone)) {
        return;
      }
      setIsLoading(true);

      if (userQuery) {
        let userQueryReq = await getUserQuery(userQuery);
        /** NIP-05 Metadata is in string
         * kind:0
         * Parsed content to UserMetadata
         */

        try {
          /** Metadata can be undefined */
          let contentParsed = JSON.parse(userQueryReq?.content);
          let profile: IUserEvent = contentParsed;
          setProfile(profile);
        } catch (e) { }

        let events = await getEventsNotesFromPubkey(userQuery, [
          1, // note
          //  + replies if NIP-10 with tags p and e t
          6, // repost
          7, // reactions
        ]);

        let notesAllTags = events?.filter((e) => e?.kind == 1);
        console.log("notesAllTags", notesAllTags);

        let reposts: INoteRepostParsed[] = [];

        /** Parse content note as anoter event to repost */
        events?.filter((e) => {
          if (e?.kind == 6) {
            let parsedNote = JSON.parse(e?.content);
            let repost = {
              event: e,
              repost: parsedNote,
            };
            reposts?.push(repost);
            return {
              event: e,
              repost: parsedNote,
            };
          }
        });
        let reactions = events?.filter((e) => e?.kind == 7);

        /** TODO fix multi reply */
        // let repliesFilter = filterRepliesOnEvents(events)
        let repliesFilter = filterRepliesOnEvents(notesAllTags)
        console.log("repliesFilter", repliesFilter);
        setReplies(repliesFilter);
        setReactions(reactions);
        setReposts(reposts);

        let notes = notesAllTags?.filter((n) => n?.tags?.length == 0 )
        // let notes = notesAllTags?.filter((n) => n?.tags?.length == 0 || !n?.tags?.find(e => e?.includes("e")))
        console.log("notes", notes);
        // console.log("reposts", reposts);
        // console.log("reactions", reactions);
        setEvents(notes);
        return events;
      }
    } catch (e) {
      console.log("Error handle event user by id", e);
    } finally {
      setIsLoading(false);
      setIsFirstLoadDone(true);
    }
  };

  const handleGoBack = (userId?: string) => {
    navigation.goBack();
  };

  const NotesRoute = () => {
    return (
      <FlatList
        contentContainerStyle={{
          paddingTop: 16,
          // paddingBottom: bottomBarHeight,
        }}
        data={events}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => {
          return (
            <Post
              //  post={item}
              sourceUser={profile?.picture}
              event={item}
            />
          );
        }}
        ItemSeparatorComponent={() => (
          <View style={{ marginVertical: 18 }}>
            <Divider />
          </View>
        )}
      />
    );
  };


  /** TODO fix issue multi renders replies */
  const RepliesRoute = () => {
    return (
      <FlatList
        contentContainerStyle={{
          paddingTop: 16,
        }}
        data={replies}
        // keyExtractor={(item,index) => item?.id}
        keyExtractor={(item, index) => index?.toString()}
        renderItem={({ item, index }) => {
          return <Post
            key={index}

            event={item}
            sourceUser={profile?.picture}
          />;
        }}
        ItemSeparatorComponent={() => (
          <View style={{ marginVertical: 18 }}>
            <Divider />
          </View>
        )}
      />
    );
  };

  const RepostRoute = () => {
    // const bottomBarHeight = useBottomTabBarHeight();

    return (
      <FlatList
        contentContainerStyle={{
          paddingTop: 16,
          // paddingBottom: bottomBarHeight,
        }}
        data={reposts}
        keyExtractor={(item) => item?.event?.id}
        renderItem={({ item }) => {
          return (
            <Post
              // post={item}
              sourceUser={profile?.picture}
              event={item?.event}
              repostedEvent={item?.repost}
            />
          );
        }}
        ItemSeparatorComponent={() => (
          <View style={{ marginVertical: 18 }}>
            <Divider />
          </View>
        )}
      />
    );
  };

  const ReactionsRoute = () => {
    // const bottomBarHeight = useBottomTabBarHeight();
    return (
      <FlatList
        contentContainerStyle={{
          paddingTop: 16,
          // paddingBottom: bottomBarHeight,
        }}
        data={reactions}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => {
          return (
            <Post
              //  post={item}
              sourceUser={profile?.picture}
              event={item}
            />
          );
        }}
        ItemSeparatorComponent={() => (
          <View style={{ marginVertical: 18 }}>
            <Divider />
          </View>
        )}
      />
    );
  };
  const renderScene = SceneMap({
    posts: NotesRoute,
    reactions: ReactionsRoute,
    reposts: RepostRoute,
    replies: RepliesRoute,
  });

  const renderTabBar = (props) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.tabBar}>
          {props?.navigationState?.routes.map((route, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.tabItem,
                  {
                    borderBottomWidth: 1,
                    // borderBottomColor: index === i ? theme.black[10] : "transparent",
                  },
                ]}
                onPress={() => setIndex(i)}
              >
                <Typography
                  variant="ts15b"
                  align="left"
                // colorCode={index === i ? theme.black[10] : theme.black[40]}
                >
                  {route.title}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <BackButton onPress={() => handleGoBack()}>
        <Typography
          variant="ts19m"
        //  colorCode={theme.black[100]}
        >
          Back
        </Typography>
      </BackButton>
      <View style={{ position: "relative", marginTop: -10, height: 270 }}>
        {profile?.banner && (
          <Image
            source={{ uri: profile?.banner }}
            style={{
              width: Platform.OS != "android" ? "100%" : 250,

              height: 200,
              resizeMode: "cover",
              marginTop: 8,
            }}
          />
        )}

        <View style={{ position: "relative" }}>
          <Image
            source={{
              uri: profile?.picture ?? require("../../assets/joyboy-logo.png"),
            }}
            style={{
              borderWidth: 2,
              borderColor: "white",
              height: 100,
              width: 100,
              resizeMode: "cover",
              borderRadius: 50,
              left: 12,
              top: 0,
              transform: [{ translateY: -50 }],
            }}
          />
        </View>
      </View>
      <View style={styles.profileContainer}>
        {isLoading && <ActivityIndicator></ActivityIndicator>}
        <Text
          style={styles.text}
        // numberOfLines={1}
        // lineBreakMode="tail"
        >
          {userQuery}
        </Text>
        <Text
          // variant="ts19m"
          style={styles.text}
        // colorCode={theme.black[10]}
        >
          {eventProfile?.profile?.name ?? profile?.name}
        </Text>

        <Text
          // variant="ts15r"
          style={styles.text}
        // colorCode={theme.black[10]}
        >
          {eventProfile?.profile?.bio ?? profile?.about}
        </Text>

        {/* Render user details here */}
      </View>
      <View style={styles.tabContainer}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
        // initialLayout={{ width: layout.width }}
        />
      </View>
    </ScrollView>
  );
};

const BackButton = styled(Pressable)`
  border-radius: 8px;
  padding: 8px 24px;
  color: white;
  border-color: black;
`;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 350,
    color: "white",
    // padding: 4,
    gap: 4,
    flex: 0.9,
  },
  tabContainer: {
    // flex: 1,
    padding: 4,
    gap: 4,
    flex: 0.9,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileContainer: {
    paddingHorizontal: 12,
    gap: 4,
    padding: 8,
  },
  text: {
    color: "black",
    fontSize: 16,
    textAlign: "left",
    marginBottom: 20,
    width: Platform.OS != "android" ? "100%" : 250,
  },
  listContainer: {
    width: Platform.OS != "android" ? "100%" : 250,
    paddingHorizontal: 20, // Add horizontal padding to create space between items
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tabBar: {
    width: Platform.OS != "android" ? "100%" : 250,
    paddingHorizontal: 4,
    flexDirection: "row",
    borderBottomColor: "#e4e4e7",
    borderBottomWidth: 1,
  },
  tabItem: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: "flex-start",
  },
});

export default UserDetailScreen;

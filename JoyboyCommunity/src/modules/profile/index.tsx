import { View, Image, StyleSheet, Platform, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components/native";
import Typography from "../../components/typography";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Divider from "../../components/divider/Divider";
import { testPostData } from "../../shared/data/testData";
import Post from "../../shared/components/Post";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import ScrollableContainer from "../../components/skeleton/ScrollableContainer";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLocalstorage } from "../../hooks/useLocalstorage";
import { useNostr } from "../../hooks/useNostr";
import { Event as EventNostr } from "nostr-tools";
import { INoteRepost1622, IUserEvent } from "../../types";

export default function Profile() {
  const theme = useTheme();
  const layout = useWindowDimensions();
  const [isConnected, setIsConnected] = useState<boolean>(false); // skip button available if possible to read data only without be connected
  const [publicKey, setPublicKey] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);

  const { retrievePublicKey } = useLocalstorage();
  const { getEvent, getUser, getEventsNotesFromPubkey, getUserQuery } =
    useNostr();
  const [profile, setProfile] = useState<IUserEvent | undefined>();
  const [isFirstLoadDone, setIsFirstLoadDone] = useState<boolean | undefined>(
    false
  );

  const [events, setEvents] = useState<EventNostr[] | undefined>();
  const [replies, setReplies] = useState<EventNostr[] | undefined>();
  const [reposts, setReposts] = useState<INoteRepost1622[] | undefined>();
  const [reactions, setReactions] = useState<EventNostr[] | undefined>();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "posts", title: "Posts" },
    { key: "replies", title: "Replies" },
    { key: "reactions", title: "Reactions" },
    { key: "reposts", title: "Reposts" },
  ]);

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

  const RepliesRoute = () => {
    return (
      <FlatList
        contentContainerStyle={{
          paddingTop: 16,
        }}
        data={replies}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => {
          return <Post event={item} />;
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
  // Fetch user based on userId pubkey
  useEffect(() => {
    const isConnectedUser = async () => {
      try {
        let publicKeyConnected = await retrievePublicKey();

        if (!publicKeyConnected) {
          alert("Please login");
          return;
        } else {
          setIsConnected(true);
          setPublicKey(publicKeyConnected);
        }
      } catch (e) {}
    };

    isConnectedUser();
  }, []);

  console.log("profile", profile);
  // Fetch user based on userId pubkey
  useEffect(() => {
    const handleInfo = async () => {
      try {
        if (publicKey && !isLoading && !profile && !isFirstLoadDone) {
          await handleMyProfileByPublicKey();
        }
      } catch (e) {}
    };
    handleInfo();
  }, [publicKey, isLoading, profile, isFirstLoadDone]);

  const handleMyProfileByPublicKey = async () => {
    try {
      console.log("handleMyProfileByPublicKey try get event");
      if (isLoading || !publicKey || profile) {
        return;
      }
      setIsLoading(true);
      console.log("publicKey", publicKey);

      if (publicKey) {
        console.log("get profile data");

        let userQueryReq = await getUserQuery(publicKey);
        console.log("userQueryReq", userQueryReq);

        /** NIP-05 Metadata is in string
         * kind:0
         * Parsed content to UserMetadata
         */
        let contentParsed = JSON.parse(userQueryReq?.content);
        let profile: IUserEvent = contentParsed;
        console.log("profile");
        setProfile(profile);

        let events = await getEventsNotesFromPubkey(publicKey, [
          1, // note
          6, // repost
          7, // reactions
          1622, // replies
        ]);

        let notes = events?.filter((e) => e?.kind == 1);

        let reposts: INoteRepost1622[] = [];

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
        let replies = events?.filter((e) => e?.kind == 1622);
        setReplies(replies);
        setReactions(reactions);
        setReposts(reposts);
        console.log("replies", replies);
        console.log("notes", notes);
        console.log("reposts", reposts);
        console.log("reactions", reactions);
        setEvents(notes);
        return events;
      }
    } catch (e) {
      console.log("Error handle my profile user by id", e);
    } finally {
      setIsLoading(false);
      setIsFirstLoadDone(true);
    }
  };

  const renderTabBar = (props) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.tabBar}>
          {props.navigationState.routes.map((route, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.tabItem,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor:
                      index === i ? theme.black[10] : "transparent",
                  },
                ]}
                onPress={() => setIndex(i)}
              >
                <Typography
                  variant="ts15b"
                  align="left"
                  colorCode={index === i ? theme.black[10] : theme.black[40]}
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
  const renderScene = SceneMap({
    posts: NotesRoute,
    reactions: ReactionsRoute,
    reposts: RepostRoute,
    replies: RepliesRoute,
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: "relative", marginTop: -10, height: 270 }}>
        <Image
          source={{ uri: "https://picsum.photos/200/300" }}
          style={{
            width: Platform.OS != "android" ? "100%" : 250,

            height: 200,
            resizeMode: "cover",
            marginTop: 8,
          }}
        />
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: "https://picsum.photos/201/300" }}
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
      <View style={{ paddingHorizontal: 12, gap: 4 }}>
        <Typography variant="ts19m" colorCode={theme.black[10]}>
          {publicKey ?? ""}
        </Typography>

        <Typography variant="ts19m" colorCode={theme.black[10]}>
          {profile?.display_name ?? ""}
        </Typography>

        <Typography variant="ts15r" colorCode={theme.black[10]}>
          {profile?.about}
        </Typography>

        {/* TODO navigate to edit profile */}

        <View>
          <Pressable>
            <Typography>Edit your profile</Typography>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1, paddingTop: 8 }}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

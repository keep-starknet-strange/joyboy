import React, { useEffect, useMemo, useState } from "react";
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
import {
  INoteRepostParsed,
  IUserEvent,
  RootStackUserDetailScreenProps,
} from "../../types";
import { useNostr } from "../../hooks/useNostr";
import { Event as EventNostr } from "nostr-tools";
import styled, { useTheme } from "styled-components";
import Typography from "../../components/typography";
import { SceneMap, TabView } from "react-native-tab-view";
import { NDKUser } from "@nostr-dev-kit/ndk";
import { filterRepliesOnEvents } from "../../utils/filter";
import {
  NotesRoute,
  ReactionsRoute,
  RepostsRoute,
  RepliesRoute,
} from "./routes";
import styles from "./styles";

/** @TODO fetch user */
export const UserDetail: React.FC<RootStackUserDetailScreenProps> = ({
  route,
}) => {
  const { userId: userQuery } = route.params;

  const { getEvent, getUser, getEventsNotesFromPubkey, getUserQuery } =
    useNostr();

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
  }, [eventProfile, userQuery, isLoading]);
  const handleGetUserEventById = async () => {
    try {
      console.log("handleGetEventById try get event");
      if (isLoading || profile || isFirstLoadDone) {
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
        } catch (e) {}

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
        let repliesFilter = filterRepliesOnEvents(notesAllTags);
        console.log("repliesFilter", repliesFilter);
        setReplies(repliesFilter);
        setReactions(reactions);
        setReposts(reposts);

        let notes = notesAllTags?.filter((n) => n?.tags?.length == 0);
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

  const renderScene = useMemo(() => {
    return SceneMap({
      posts: () => <NotesRoute events={events} profile={profile} />,
      reactions: () => (
        <ReactionsRoute reactions={reactions} profile={profile} />
      ),
      reposts: () => <RepostsRoute reposts={reposts} profile={profile} />,
      replies: () => <RepliesRoute replies={replies} profile={profile} />,
    });
  }, [profile, events, reactions, reposts, replies]);

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
              width: "100%",

              height: 200,
              resizeMode: "cover",
              marginTop: 8,
            }}
          />
        )}

        <View style={{ position: "relative" }}>
          <Image
            source={{
              uri:
                profile?.picture ?? require("../../../assets/joyboy-logo.png"),
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

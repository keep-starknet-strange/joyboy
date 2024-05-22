import { View, Pressable } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "styled-components/native";
import { Event as EventNostr } from "nostr-tools";
import { Typography } from "../../components";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { useLocalstorage } from "../../hooks/useLocalstorage";
import { useNostr } from "../../hooks/useNostr";
import { INoteRepostParsed, IUserEvent } from "../../types";
import { filterRepliesOnEvents } from "../../utils/filter";
import {
  NotesRoute,
  RepliesRoute,
  RepostsRoute,
  ReactionsRoute,
} from "./routes";
import {
  AboutContainer,
  CoverImage,
  ImageContainer,
  ProfileImage,
  TabBar,
  TabBarContainer,
  TabItem,
} from "./styled";

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
  const [reposts, setReposts] = useState<INoteRepostParsed[] | undefined>();
  const [reactions, setReactions] = useState<EventNostr[] | undefined>();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "posts", title: "Posts" },
    { key: "replies", title: "Replies" },
    { key: "reactions", title: "Reactions" },
    { key: "reposts", title: "Reposts" },
  ]);

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

  // console.log("profile", profile);
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
      // console.log("publicKey", publicKey);

      if (publicKey) {
        console.log("get profile data");

        let userQueryReq = await getUserQuery(publicKey);
        // console.log("userQueryReq", userQueryReq);

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

        let events = await getEventsNotesFromPubkey(publicKey, [
          1, // note
          6, // repost
          7, // reactions
        ]);

        let notesAllTags = events?.filter((e) => e?.kind == 1);

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
        // let replies = filterRepliesOnEvents(events)
        let repliesFilter = filterRepliesOnEvents(notesAllTags);

        setReplies(repliesFilter);
        setReactions(reactions);
        setReposts(reposts);
        console.log("replies", repliesFilter);
        let notes = notesAllTags?.filter((n) => n?.tags?.length == 0);
        // let notes = notesAllTags?.filter((n) => n?.tags?.length == 0 || !n?.tags?.find(e => e?.includes("e")))
        console.log("notes", notes);
        // console.log("reposts", reposts);
        // console.log("reactions", reactions);
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
      <TabBarContainer>
        <TabBar>
          {props.navigationState.routes.map((route, i) => {
            return (
              <TabItem
                key={i}
                style={[
                  {
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
              </TabItem>
            );
          })}
        </TabBar>
      </TabBarContainer>
    );
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

  return (
    <View style={{ flex: 1 }}>
      <ImageContainer>
        <CoverImage source={{ uri: "https://picsum.photos/200/300" }} />

        <View style={{ position: "relative" }}>
          <ProfileImage source={{ uri: "https://picsum.photos/201/300" }} />
        </View>
      </ImageContainer>

      <AboutContainer>
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
      </AboutContainer>

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

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
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useNostr } from "../hooks/useNostr";
import { Event as EventNostr } from "nostr-tools";
import styled, { useTheme } from "styled-components";
import Typography from "../components/typography";
import { SceneMap, TabView } from "react-native-tab-view";
// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Post from "../shared/components/Post";
import Divider from "../components/divider/Divider";
import { testPostData } from "../shared/data/testData";
import { NDKUser } from "@nostr-dev-kit/ndk";
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

const FirstRoute = (events: EventNostr[]) => {
  // const bottomBarHeight = useBottomTabBarHeight();
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

const SecondRoute = (datas: EventNostr[]) => {
  // const bottomBarHeight = useBottomTabBarHeight();

  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: 16,
        // paddingBottom: bottomBarHeight,
      }}
      data={datas}
      keyExtractor={(item) => item?.id}
      renderItem={({ item }) => {
        return (
          <Post
            // post={item}
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

const ThirdRoute = (datas: EventNostr[]) => {
  // const bottomBarHeight = useBottomTabBarHeight();
  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: 16,
        // paddingBottom: bottomBarHeight,
      }}
      data={datas}
      keyExtractor={(item) => item?.id}
      renderItem={({ item }) => {
        return (
          <Post
            //  post={item}
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

/** @TODO fetch user */
const UserDetailScreen: React.FC<Props> = ({ route, userId }) => {
  const { getEvent, getUser, getEventsNotesFromPubkey } = useNostr();

  const { userId: userQuery } = route.params;
  const [eventProfile, setEventProfile] = useState<NDKUser | undefined>();
  const [eventsTool, setEventsTool] = useState<EventNostr[] | undefined>();
  const [events, setEvents] = useState<EventNostr[] | undefined>();
  const [imgUser, setImageUser] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);
  const [contentParsed, setContentParsed] = useState<string | undefined>();
  // const layout = useWindowDimensions();
  // const theme = useTheme();
  const [routes] = React.useState([
    { key: "posts", title: "Posts" },
    { key: "replies", title: "Replies" },
    { key: "likes", title: "Likes" },
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
      if (isLoading || eventProfile) {
        return;
      }
      setIsLoading(true);

      if (userQuery) {
        let eventUser = await getUser(userQuery);
        console.log("eventUser", eventUser);
        console.log("eventUser profile", eventUser?.profile);
        // let profile = await eventUser?.fetchProfile();
        // console.log("profile", profile);
        setEventProfile(eventUser);

        let events = await getEventsNotesFromPubkey(userQuery);
        console.log("events user", events);
        setEvents(events);
        return events;
      }
    } catch (e) {
      console.log("Error handle event user by id", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = (userId?: string) => {
    navigation.goBack();
  };

  const FirstRoute = () => {
    // const bottomBarHeight = useBottomTabBarHeight();
    return (
      <FlatList
        contentContainerStyle={{
          paddingTop: 16,
          // paddingBottom: bottomBarHeight,
        }}
        data={events}
        // data={testPostData}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => {
          return (
            <Post
              //  post={item}
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
    posts: FirstRoute,
    replies: SecondRoute,
    likes: ThirdRoute,
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
    <ScrollView
    style={styles.container}
    >
      <BackButton onPress={() => handleGoBack()}>
        <Typography
          variant="ts19m"
          //  colorCode={theme.black[100]}
        >
          Back
        </Typography>
      </BackButton>
      <View 
      style={styles.profileContainer}>
        <Image
          source={
            eventProfile?.profile?.image ??
            require("../../assets/joyboy-logo.png")
          }
          style={styles.profilePicture}
        />

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
          {eventProfile?.profile?.name}
        </Text>

        <Text
          // variant="ts15r"
          style={styles.text}
          // colorCode={theme.black[10]}
        >
          {eventProfile?.profile?.bio}
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
    padding: 4,
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

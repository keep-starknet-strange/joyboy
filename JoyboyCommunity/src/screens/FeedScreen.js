// src/screens/FeedScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from "react-native";
import PostCard from "../components/PostCard";
import CardPost from "../components/CardPost";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import { useNostr } from "../hooks/useNostr";
import { Event as NostrEvent } from "nostr-tools";

function FeedScreen({ navigation }) {
  const [isReady, setIsReady] = React.useState(false);

  // const postData = [
  //   {
  //     id: "1",
  //     content: "Hello Joyboy World!",
  //     author: "User1",
  //     source: undefined,
  //   },
  //   {
  //     id: "2",
  //     content: "Another post in Joyboy",
  //     author: "User2",
  //     source: undefined,
  //   },
  // ];
  // const [eventsData, setEventsData] = useState<EventNostr[]>(events ?? []);
  const { getEvents, setEvents, events } = useNostr();

  const [eventsData, setEventsData] = useState(events ?? []);

  // useEffect(() => {}, [events]);

  console.log("events feed", events);
  console.log("eventsData feed", eventsData);
  useEffect(() => {
    // setTimeout(() => {
    //   setIsReady(true);
    // }, 1500); // Splash screen will be shown for 3 seconds
    const handeGetData = async () => {
      if (isReady && events?.length > 0 && eventsData?.length > 0) {
        return;
      }

      const events = await getEvents();
      console.log("events", events);
      setEvents(events);
      setIsReady(true);
    };

    if (!isReady && events?.length == 0 && eventsData?.length == 0) {
      handeGetData();
    }
  }, [isReady, eventsData]);

  return (
    <>
      <View
        style={styles.container}
        // style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >

        <FlatList
          data={events}
          keyExtractor={(item) => item?.id}
          
          contentContainerStyle={styles.contentContainer}
          // style={styles.container}
          renderItem={({ item }) => {
            return (
              <PostCard
                navigation={navigation}
                post={item}
                event={item}
              ></PostCard>
            );
          }}
        />

        {/* <Pressable
          title="Post Something"
          onPress={() => navigation.navigate("Profile")}
        /> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'scroll', // or overflow: 'auto' if necessary
    height:"100%",

    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
  },
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "#fff",
  // },
  // container: {
  //   flex: 1,
  //   width: "100%",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   width: "100%",
  //   // backgroundColor: '#fff', // Background color of the top bar
  //   paddingTop: 30, // Adjust this value to add spacing if needed
  //   paddingBottom: 10,
  //   paddingHorizontal: 20,
  //   borderBottomWidth: 1,
  //   // borderBottomColor: '#ccc', // Border color
  //   alignItems: "center",
  // },
  listContainer: {
    width: "100%", // Ensure the FlatList occupies the entire width
    // paddingHorizontal: 20, // Add horizontal padding to create space between items
    height:"100%"
  },

  // container: {
  //   width: "100%", // Ensure the FlatList occupies the entire width
  //   // paddingHorizontal: 20, // Add horizontal padding to create space between items
  //   // height:"100%"
  // },
  item: {
    // width: 150, // Set width of each item
    // height: 100, // Set height of each item
    // backgroundColor: "#ccc",
    // justifyContent: "center",
    // alignItems: "center",
    // marginHorizontal: 5, // Add margin between items
    // borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default FeedScreen;

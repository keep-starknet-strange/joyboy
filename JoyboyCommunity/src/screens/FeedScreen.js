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
  ActivityIndicator,
} from "react-native";
import PostCard from "../components/PostCard";
import { useNostr } from "../hooks/useNostr";

function FeedScreen({ navigation }) {
  const [isReady, setIsReady] = React.useState(false);

  const { getEvents, setEvents, events, getEventsPost, eventsData } =
    useNostr();

  const [eventsDataFeed, setEventsData] = useState(events ?? []);
  useEffect(() => {
    console.log("events feed", events);
    console.log("eventsData feed", eventsData);
    console.log("eventsDataFeed feed", eventsDataFeed);

    const handeGetData = async () => {
      if (isReady && events?.length > 0 && eventsData?.length > 0) {
        return;
      }

      const events = await getEventsPost(true);
      console.log("events", events);
      setEvents(events);
      setIsReady(true);
    };

    if (!isReady && events?.length == 0 && eventsData?.length == 0) {
      handeGetData();
    }
  }, [isReady, eventsData, events, eventsDataFeed]);

  return (
    <>
      <View style={styles.container}>
        {!isReady && (
          <ActivityIndicator
            size="large"
            style={styles.loader}
          ></ActivityIndicator>
        )}
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll", // or overflow: 'auto' if necessary
    height: "100%",
    backgroundColor: "#022b3a", // Change the background color of the header
  },
  loader: {
    color: "white",
    // backgroundColor: "white",
    margin:10
  },
  contentContainer: {
    flexGrow: 1,
    padding: 0,
    margin: 0,
  },
  listContainer: {
    width: "100%", // Ensure the FlatList occupies the entire width
    // paddingHorizontal: 20, // Add horizontal padding to create space between items
    height: "100%",
    // gap: "10px",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default FeedScreen;

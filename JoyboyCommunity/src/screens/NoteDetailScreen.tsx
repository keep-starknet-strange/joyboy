// screens/PostDetailScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useNostr } from "../hooks/useNostr";
import { Event as EventNostr } from "nostr-tools";
type PostDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "NoteDetailScreen"
>;

type PostDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NoteDetailScreen"
>;

type Props = {
  route: PostDetailScreenRouteProp;
  navigation: PostDetailScreenNavigationProp;
};

const PostDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { noteId } = route.params;
  // console.log("noteId", noteId);

  // Fetch note details based on postId or use any other logic
  const [eventNote, setEventNote] = useState<EventNostr | undefined>();
  const [contentParsed, setContentParsed] = useState<string | undefined>();
  const [imgUser, setImageUser] = useState<string | undefined>();
  const { parsingEventContent, events, getEvent } = useNostr();

  const event = events?.find((e) => e?.id == noteId);
  // console.log("event", event);
  const handleGetEventById = async () => {
    // console.log("handleGetEventById try get event");
    let event = await getEvent(noteId);
    console.log("event note", event);
    setEventNote(event);
    return event;
  };

  useEffect(() => {
    if ((!eventNote && noteId) || eventNote?.id != noteId) {
      handleGetEventById();
    } else if (eventNote && eventNote?.content) {
      let parseEvent = parsingEventContent(eventNote);
      // console.log("parseEvent", parseEvent);
      setContentParsed(parseEvent);
    }
  }, [event, eventNote, noteId]);
  const handleProfilePress = (userId: string) => {
    navigation.navigate("UserDetailScreen", { userId });
  };

  return (
    <View style={styles.container}>
      {/* <Text lineBreakMode="tail" style={styles.text} numberOfLines={2}>
        {noteId}
      </Text> */}

      {eventNote && eventNote?.created_at && (
        <Text style={styles.timestamp}>
          {new Date(Number(eventNote?.created_at) * 1000)?.toISOString()}
        </Text>
      )}

      <TouchableOpacity onPress={() => handleProfilePress(eventNote?.pubkey)}>
        <Image
          source={imgUser ?? require("../../assets/joyboy-logo.png")}
          style={{ width: 50, height: 50 }}
        />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        {eventNote?.id == noteId && contentParsed && (
          <Text style={styles.text} lineBreakMode="tail">
            {contentParsed}
          </Text>
        )}
      </View>
      {/* Render post details here */}

      {/* @TODO render metadata */}

      {/* TODO render interactions NOSTR */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#022b3a",
    height: "100%",
    color: "white",
    padding: 4,
  },
  text: {
    color: "white",
  },
  contentContainer: {
    padding: 8,
  },
  listContainer: {
    width: "100%", // Ensure the FlatList occupies the entire width
    paddingHorizontal: 20, // Add horizontal padding to create space between items
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
});

export default PostDetailScreen;

// screens/PostDetailScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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

  // Fetch post details based on postId or use any other logic
  const [eventNote, setEventNote] = useState<EventNostr | undefined>();
  const [contentParsed, setContentParsed] = useState<string | undefined>();
  const { parsingEventContent, events, getEvent } = useNostr();

  console.log("events", events);

  const event = events?.find((e) => e?.id == noteId);
  console.log("event", event);
  const handleGetEventById = async () => {
    console.log("handleGetEventById try get event");
    let event = await getEvent(noteId);
    console.log("event", event);
    setEventNote(event);
    return event;
  };

  useEffect(() => {
    if (!eventNote && noteId) {
      handleGetEventById();
    } else if (eventNote) {
      let parseEvent = parsingEventContent(eventNote);
      console.log("parseEvent", parseEvent);
      setContentParsed(parseEvent);
    }
  }, [event, eventNote, noteId]);
  const handleProfilePress = (userId: string) => {
    navigation.navigate("UserDetailScreen", { userId });
  };

  return (
    <View>
      <Text>Post ID: {noteId}</Text>
      <TouchableOpacity onPress={() => handleProfilePress(eventNote?.pubkey)}>
        {/* <Image
          // source={{ uri:  "@expo/snack-static/joyboy-logo.png" }}
          source={source ?? require("../../assets/joyboy-logo.png")}
          // source={{ uri:  "@expo/snack-static/react-native-logo.png" }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        /> */}
      </TouchableOpacity>
      <View>
        <Text>Content event note: {contentParsed}</Text>
      </View>
      {/* Render post details here */}
    </View>
  );
};

export default PostDetailScreen;

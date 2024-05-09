// screens/PostDetailScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
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

const PostDetailScreen: React.FC<Props> = ({ route }) => {
  const { noteId } = route.params;

  // Fetch post details based on postId or use any other logic
  const [eventNote, setEventNote] = useState<EventNostr | undefined>();
  const { parsingEvent, events, getEvent } = useNostr();

  console.log("events", events);

  const event = events?.find((e) => e?.id == noteId);
  console.log("event", event);

  useEffect(() => {
    const handleGetEventById = async () => {
      console.log("handleGetEventById try get event");
      let event = await getEvent(noteId);
      console.log("event", event);
      setEventNote(event);
      return event;
    };
    if (event) {
      let parseEvent = parsingEvent(event);
      console.log("parseEvent", parseEvent);
    } else if (!eventNote && noteId) {
      handleGetEventById();
    }
  }, [event, eventNote, noteId]);
  return (
    <View>
      <Text>Post Detail Screen</Text>
      <Text>Post ID: {noteId}</Text>
      <Text>Content: {event?.content}</Text>
      <Text>Content event note: {eventNote?.content}</Text>
      {/* Render post details here */}
    </View>
  );
};

export default PostDetailScreen;

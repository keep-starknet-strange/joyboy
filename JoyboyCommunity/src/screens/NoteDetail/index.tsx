import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Event as EventNostr } from "nostr-tools";
import { RootStackNoteDetailScreenProps } from "../../types";
import { useNostr } from "../../hooks/useNostr";
import styles from "./styles";

export const NoteDetail: React.FC<RootStackNoteDetailScreenProps> = ({
  route,
  navigation,
}) => {
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
    } else if (eventNote) {
      let parseEvent = parsingEventContent(eventNote);
      // console.log("parseEvent", parseEvent);
      setContentParsed(parseEvent);
    }
  }, [event, eventNote, noteId]);

  const handleProfilePress = (userId: string) => {
    navigation.navigate("UserDetail", { userId });
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

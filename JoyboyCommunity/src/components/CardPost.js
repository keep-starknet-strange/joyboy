// src/screens/FeedScreen.js

import React from "react";
import { View, Text, FlatList, Button, StyleSheet  } from "react-native";
import { Avatar } from "./Avatar";
const postData = [
  { id: "1", content: "Hello Joyboy World!", author: "User1" },
  { id: "2", content: "Another post in Joyboy", author: "User2" },
];

function CardPost({ navigation,  post }) {
  const {content, author, timestamp, source} = post
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.content}>{content}</Text>
      <Avatar navigation={navigation} source={source} />

      <View style={styles.authorContainer}>
        <Text style={styles.author}>{author.name}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#022b3a",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontSize: 14,
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
});

export default CardPost;

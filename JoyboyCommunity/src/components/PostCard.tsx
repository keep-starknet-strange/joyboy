// src/screens/FeedScreen.js

import React from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { Avatar } from "./Avatar";
const postData = [
  { id: "1", content: "Hello Joyboy World!", author: "User1" },
  { id: "2", content: "Another post in Joyboy", author: "User2" },
];

function PostCard({navigation,  post }) {
  const { content, author, timestamp, source } = post;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.authorContainer}>
        <Avatar navigation={navigation} source={source} />
        <Text style={styles.author}>{author}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>

      <Text style={styles.content}>{content}</Text>
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

export default PostCard;

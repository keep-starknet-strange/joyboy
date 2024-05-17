// src/screens/FeedScreen.js

import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Avatar } from "../avatar";

function PostPage({ navigation, post }) {
  const { content, author, timestamp, source, pubkey } = post;

  return (
    <View style={styles.card}>
      <View style={styles.authorContainer}>
        <Avatar navigation={navigation} source={source} userId={pubkey} />
        <Text style={styles.author}>{author}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.content}>{content}</Text>
      </View>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate("Home", {
        })}
      ></TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // backgroundColor: "#022b3a",
    width: Platform.OS != "android" ? "100%" : 250,
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
  contentBox: {
    padding: 8,
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
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

export default PostPage;

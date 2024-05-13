// src/screens/ProfileScreen.js

import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { CreateNote } from "../components/profile/CreateNote";
function CreatePostScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text
          style={styles.text}
          >Create your note</Text>
          <CreateNote></CreateNote>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#022b3a",
    height: "100%",
    color:"white",
  },
  text: {
    color: "white",
  },
  listContainer: {
    width: "100%", // Ensure the FlatList occupies the entire width
    paddingHorizontal: 20, // Add horizontal padding to create space between items
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CreatePostScreen;

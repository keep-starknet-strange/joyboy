// src/screens/ProfileScreen.js

import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import WalletConnect from "../components/WalletConnect";
import { EditProfile } from "../components/profile/EditProfile";
import BottomBar from "../components/BottomBar";
import { CreateNote } from "../components/profile/CreateNote";
function CreatePostScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View>
        <WalletConnect></WalletConnect>
      </View>

      <View>
        <Text>Create your note</Text>
        <CreateNote></CreateNote>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    height: "100%",
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

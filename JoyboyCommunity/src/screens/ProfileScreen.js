// src/screens/ProfileScreen.js

import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import WalletConnect from "../components/WalletConnect";
import { EditProfile } from "../components/profile/EditProfile";
function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View
      style={styles.listContainer}
      >
        <WalletConnect></WalletConnect>

        <EditProfile></EditProfile>
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
  },
  listContainer: {
    width: "100%", // Ensure the FlatList occupies the entire width
    paddingHorizontal: 20, // Add horizontal padding to create space between items
    gap:10
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ProfileScreen;

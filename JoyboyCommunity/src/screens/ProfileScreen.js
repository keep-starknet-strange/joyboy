// src/screens/ProfileScreen.js

import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import WalletConnect from "../components/WalletConnect";
import { EditProfile } from "../components/profile/EditProfile";
import BottomBar from "../components/BottomBar";
function ProfileScreen({navigation}) {
  return (
    <View
      style={styles.container}
    >
      <Text>Profile Screen</Text>
      <WalletConnect></WalletConnect>
      <EditProfile></EditProfile>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "space-between",
    // backgroundColor: "#fff",
    backgroundColor: "#022b3a",

    height:"100%"
  },
  // container: {
  //   flex: 1,
  //   width: "100%",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   width: "100%",
  //   // backgroundColor: '#fff', // Background color of the top bar
  //   paddingTop: 30, // Adjust this value to add spacing if needed
  //   paddingBottom: 10,
  //   paddingHorizontal: 20,
  //   borderBottomWidth: 1,
  //   // borderBottomColor: '#ccc', // Border color
  //   alignItems: "center",
  // },
  listContainer: {
    width: "100%", // Ensure the FlatList occupies the entire width
    paddingHorizontal: 20, // Add horizontal padding to create space between items
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ProfileScreen;

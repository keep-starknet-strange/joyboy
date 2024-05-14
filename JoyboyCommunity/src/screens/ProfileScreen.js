// src/screens/ProfileScreen.js

import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { EditProfile } from "../components/profile/EditProfile";
function ProfileScreen({ navigation }) {
  const handleLoginProcess = () => {
    navigation.navigate("Login");
  };

  const handleSignProcess = () => {
    navigation.navigate("Sign");
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <View>
          <TouchableOpacity
            onPress={() => handleSignProcess()}
            style={styles.buttonViewNote}
          >
            <Text style={styles.buttonNavigation}>Sign</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLoginProcess()}
            style={styles.buttonViewNote}
          >
            <Text style={styles.buttonNavigation}>Login</Text>
          </TouchableOpacity>
        </View>

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
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonNavigation: {
    backgroundColor: "#04506B",
    color: "black",
    // padding:"1px",
    padding: 5,
    borderRadius: 5,
    // width: "auto",
    width: 75,
    textAlign: "center",
    marginVertical:10
  },
});

export default ProfileScreen;

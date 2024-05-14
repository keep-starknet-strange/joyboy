// BottomBar.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import TopBar from "./TopBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Google from "expo-auth-session/providers/google";
import * as Keychain from "react-native-keychain";

const BottomBar = ({ navigation }) => {
  const route = useRoute();
  // // const { id_token } = navigation?.params;
  // const { id_token } = route?.params;
  // console.log("id_token", id_token);
  // // Handle authentication response
  // useEffect(() => {
  //   if (id_token) {
  //     console.log("id_token", id_token);

  //     // Store the ID token securely
  //     Keychain.setInternetCredentials("google", "idToken", id_token)
  //       .then(() => console.log("ID token stored securely"))
  //       .catch((error) => console.error("Error storing ID token:", error));
  //   }
  // }, [id_token]);


  
  const { goBack } = useNavigation();

  const handleGoBack = () => {
    goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Home")}
        >
          <Text
          style={styles?.textTab}
          
          >Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Create")}
        >
          <Text
          style={styles?.textTab}
          >Create</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text
          style={styles?.textTab}
          >Profile</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#022b3a", // Background color of the bottom bar
    borderTopWidth: 1,
    borderTopColor: "#ccc", // Border color
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    // color:"#fff"
    color:"white"
    
  },
  tab: {
    alignItems: "center",
    color:"white"

  },
  textTab: {
    color:"white",
    fontSize:16
  },
});

export default BottomBar;

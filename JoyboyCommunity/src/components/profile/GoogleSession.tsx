import React, { useEffect, useState } from "react";
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Button,
  Text,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as Keychain from "react-native-keychain";
import { AuthSessionResult } from "expo-auth-session";

export const GoogleSession = () => {
  const clientId= process.env.EXPO_GOOGLE_CLIENT_ID;
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId,
  });

  // Handle authentication response
  useEffect(() => {
    console.log("response",response)

    if (response?.type === "success") {
      const { id_token } = response.params;
      console.log("id_token",id_token)

      // Store the ID token securely
      Keychain.setInternetCredentials("google", "idToken", id_token)
        .then(() => console.log("ID token stored securely"))
        .catch((error) => console.error("Error storing ID token:", error));
    }
  }, [response]);

  // Handle sign-in button press
  const handleSignIn = async () => {
    let authResult = await promptAsync();
  };

  return (
    <View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignIn}
      >
        <Text>Google</Text>
      </TouchableOpacity>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "white",
  },
  button: {
    backgroundColor: "#04506B",
    color: "black",
    // padding:"1px",
    padding: 5,
    borderRadius: 5,
    // width: "auto",
    width: 130,
    textAlign: "center",
    marginVertical: 10,
  },
});

import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import * as Keychain from "react-native-keychain";

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleNavigateProfile = () => {
    navigation.navigate("Profile");
  };
  useEffect(() => {
    try {
      // Check if credentials are already stored
      Keychain.getInternetCredentials("auth")
        .then((credentials) => {
          if (credentials) {
            // Credentials found, navigate to the main screen
            console.log("Credentials found:", credentials);
            // Navigate to the main screen
          }
        })
        .catch((error) => {
          console.error("Error checking credentials:", error);
        });
    } catch (e) {}
  }, []);

  const handleLogin = () => {
    try {
      // Authenticate the user (e.g., validate username/password)
      // For demonstration, let's assume authentication is successful

      // Store the credentials securely
      Keychain.setInternetCredentials("auth", username, password)
        .then(() => {
          console.log("Credentials stored successfully");
          // Navigate to the main screen
        })
        .catch((error) => {
          console.error("Error storing credentials:", error);
          Alert.alert(
            "Error",
            "Failed to store credentials. Please try again."
          );
        });
    } catch (e) {}
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Button
        title="Biometric"
        //    onPress={callBiometric}
      />
      <Button title="Login" onPress={handleLogin} />

      <Button title="Back" onPress={handleNavigateProfile}></Button>
    </View>
  );
};

export default LoginScreen;

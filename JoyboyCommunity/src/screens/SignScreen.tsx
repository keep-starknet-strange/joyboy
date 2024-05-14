import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import * as Keychain from "react-native-keychain";
import {
  getCredentialsWithBiometry,
  isBiometrySupported,
  saveCredentialsWithBiometry,
} from "../hooks/generatePassword";

const SignScreen = ({navigation}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Example usage
  const callBiometric = async () => {
    const biometrySupported = await isBiometrySupported();

    if (biometrySupported) {
      // Save credentials with biometric protection
      await saveCredentialsWithBiometry(username, password);

      // Retrieve credentials with biometric authentication
      const credentials = await getCredentialsWithBiometry();

      if (credentials) {
        console.log("Username:", credentials.username);
        console.log("Password:", credentials.password);
        alert(JSON.stringify(credentials.username + credentials.password));
      } else {
        console.log(
          "Biometric authentication failed or credentials not found."
        );
        alert(
          JSON.stringify(
            "Biometric authentication failed or credentials not found."
          )
        );
      }
    } else {
      console.log("Biometry not supported on this device.");
      alert("Biometry not supported on this device.");
    }
  };

  // useEffect(() => {
  //   // Check if credentials are already stored
  //   Keychain.getInternetCredentials('auth')
  //     .then(credentials => {
  //       if (credentials) {
  //         // Credentials found, navigate to the main screen
  //         console.log('Credentials found:', credentials);
  //         // Navigate to the main screen
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error checking credentials:', error);
  //     });
  // }, []);

  // const handleLogin = () => {
  //   // Authenticate the user (e.g., validate username/password)
  //   // For demonstration, let's assume authentication is successful

  //   // Store the credentials securely
  //   Keychain.setInternetCredentials('auth', username, password)
  //     .then(() => {
  //       console.log('Credentials stored successfully');
  //       // Navigate to the main screen
  //     })
  //     .catch(error => {
  //       console.error('Error storing credentials:', error);
  //       Alert.alert('Error', 'Failed to store credentials. Please try again.');
  //     });
  // };
  const handleNavigateProfile = () => {
    navigation.navigate("Profile");
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
      <Button title="Biometric" onPress={callBiometric} />

      <Button
        title="Create"
        // onPress={handleLogin}
      />
      <Button title="Back" onPress={handleNavigateProfile}></Button>
    </View>
  );
};

export default SignScreen;

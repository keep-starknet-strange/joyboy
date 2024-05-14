import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Keychain from "react-native-keychain";
import {
  getCredentialsWithBiometry,
  isBiometrySupported,
  saveCredentialsWithBiometry,
} from "../hooks/keychain";
import { GoogleSession } from "../components/profile/GoogleSession";

const SignScreen = ({ navigation }) => {
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

  // const [userInfo, setUserInfo] = useState(null);
  // //client IDs from .env
  // const config = {
  //   // androidClientId: process.env.GOOGLE_CLIENT_ID,
  //   // iosClientId: process.env.GOOGLE_CLIENT_ID,
  //   webClientId: process.env.GOOGLE_CLIENT_ID,
  // };

  // const [request, response, promptAsync] = Google.useAuthRequest(config);

  const handleLogin = () => {
    // Authenticate the user (e.g., validate username/password)
    // For demonstration, let's assume authentication is successful

    // Store the credentials securely
    Keychain.setGenericPassword(username, password)
      .then(() => {
        console.log("Credentials stored successfully");
        // Navigate to the main screen
      })
      .catch((error) => {
        console.error("Error storing credentials:", error);
        Alert.alert("Error", "Failed to store credentials. Please try again.");
      });
  };
  const handleNavigateProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {" "}
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
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            Login credentials
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={callBiometric}>
          <Text>Biometric</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button}>Login</TouchableOpacity> */}
        <GoogleSession></GoogleSession>
        {/* <TouchableOpacity
          style={styles.button}
          // onPress={signInWithGoogle}
        >
          <Text>Google</Text>
        </TouchableOpacity> */}
        <Button title="Back" onPress={handleNavigateProfile}></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#022b3a",
    height: "100%",
    color: "white",
    padding: 4,
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

export default SignScreen;

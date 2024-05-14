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
// Import the package, NIP-07 signer and NDK event
import NDK, { NDKEvent, NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { useNostr } from "../hooks/useNostr";
import { encrypt, decrypt } from "crypto-js"; // Import encryption functions from crypto-js
import { useLocalstorage } from "../hooks/useLocalstorage";

const SignScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { generateKeypair } = useNostr();
  const { encryptAndStorePrivateKey, retrieveAndDecryptPrivateKey } =
    useLocalstorage();

  const callBiometric = async () => {
    const biometrySupported = await isBiometrySupported();
    // if (biometrySupported) {
    if (biometrySupported) {
      // Save credentials with biometric protection
      await saveCredentialsWithBiometry(username, password);

      // Retrieve credentials with biometric authentication
      const credentials = await getCredentialsWithBiometry();
      if (credentials) {
        alert(JSON.stringify(credentials.username + credentials.password));

        /**Generate keypair */
        let { pk, sk } = generateKeypair();

        /** Save pk in localstorage */
        let encryptedPk = encryptAndStorePrivateKey(sk, credentials?.password);
      } else {
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

  const handleNavigateProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.button} onPress={callBiometric}>
          <Text>Biometric connection</Text>
        </TouchableOpacity>
        <GoogleSession></GoogleSession>
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

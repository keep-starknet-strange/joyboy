import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import ScreenContainer from "../../components/skeleton/ScreenContainer";
import styled, { useTheme } from "styled-components/native";
import Typography from "../../components/typography";
import { useNostr } from "../../hooks/useNostr";
import { useLocalstorage } from "../../hooks/useLocalstorage";
import {
  generatePassword,
  getCredentialsWithBiometry,
  isBiometrySupported,
  saveCredentialsWithBiometry,
} from "../../utils/keychain";
const LoginButton = styled(Pressable)`
  border-radius: 8px;
  padding: 8px 24px;
  color: white;
`;

const SkipButton = styled(Pressable)`
  background-color: black;
  border-radius: 8px;
  padding: 8px 24px;
`;

export default function Login() {
  const { login } = useAuth();
  const theme = useTheme();
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [publicKey, setPublicKey] = useState<string | undefined>();
  const [privateKey, setPrivateKey] = useState<Uint8Array | undefined>();
  const { generateKeypair } = useNostr();
  const { encryptAndStorePrivateKey, retrieveAndDecryptPrivateKey } =
    useLocalstorage();

  const callBiometric = async () => {
    if (username?.length == 0 || !username) {
      alert("Enter username to login");
      return;
    }
    if (password?.length == 0 || !password) {
      alert("Enter password");
      return;
    }
    const biometrySupported = await isBiometrySupported();
    // if (true) { // BY PASS in dev web
    if (biometrySupported) {
      // Save credentials with biometric protection
      await saveCredentialsWithBiometry(username, password);

      let credentialsSaved = await generatePassword(username, password);

      // Retrieve credentials with biometric authentication
      const credentials = await getCredentialsWithBiometry();
      if (credentials) {
        alert(JSON.stringify(credentials.username + credentials.password));

        /**Generate keypair */
        let { pk, sk } = generateKeypair();

        setPublicKey(pk);
        setPrivateKey(sk);

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

  return (
    <ScreenContainer
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
    >
      <View
        // style={{
        //   justifyContent: "center",
        //   alignItems: "center",
        //   gap: 1,
        // }}
        style={styles.inputContainer}
      >
        <Text>Generate your Nostr keypair with biometric</Text>

        <TextInput
          style={[styles.input]}
          //  placeholder={placeholder}
          placeholderTextColor="#888"
          //  secureTextEntry={secureTextEntry}
          //  value={value}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <LoginButton onPress={callBiometric}
        style={{paddingVertical:3}}
        >
          <Typography
            variant="ts19m"
            // colorCode={theme.black[100]}
          >
            Login
          </Typography>
        </LoginButton>

        {publicKey && <Text selectable={true}>{publicKey}</Text>}
      </View>

      <SkipButton onPress={login}>
        <Typography variant="ts19m" colorCode={theme.black[100]}>
          Skip
        </Typography>
      </SkipButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    color: "#000",
    fontSize: 16,
    // Shadow for better visibility
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  inputFocused: {
    borderColor: "#007AFF", // Change border color when focused
  },
});

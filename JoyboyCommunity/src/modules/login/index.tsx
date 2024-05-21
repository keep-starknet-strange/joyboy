import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Typography, ScreenContainer } from "../../components";
import { useNostr } from "../../hooks/useNostr";
import { useLocalstorage } from "../../hooks/useLocalstorage";
import {
  generatePassword,
  getCredentialsWithBiometry,
  isBiometrySupported,
  saveCredentialsWithBiometry,
} from "../../utils/keychain";
import { utf8StringToUint8Array } from "../../utils/format";
import {
  CreateAccountButton,
  ImportButton,
  LoginButton,
  SkipButton,
} from "./styled";
import styles from "./styles";

enum LoginStep {
  HOME = "HOME",
  IMPORT = "IMPORT",
  CREATE_ACCOUNT = "CREATE_ACCOUNT",
  ACCOUNT_CREATED = "ACCOUNT_CREATED",
  EXPORTED_ACCOUNT = "EXPORTED_ACCOUNT",
}

export default function Login() {
  const { login } = useAuth();

  const [step, setStep] = useState<LoginStep>(LoginStep.HOME);
  const [bypassBiometric, setBiometrics] = useState<boolean>(
    Platform.OS == "web" ? true : false
  ); // DEV MODE in web to bypass biometric connection
  const [isSkipAvailable, setIsSkipAvailable] = useState<boolean>(true); // skip button available if possible to read data only without be connected
  const [isConnected, setIsConnected] = useState<boolean>(false); // skip button available if possible to read data only without be connected
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [publicKey, setPublicKey] = useState<string | undefined>();
  const [privateKeyImport, setImportPrivateKey] = useState<
    string | undefined
  >();
  const [privateKey, setPrivateKey] = useState<Uint8Array | undefined>();
  const [privateKeyReadable, setPrivateKeyReadable] = useState<
    string | undefined
  >();

  let isImportDisabled: boolean =
    !password ||
    !privateKeyImport ||
    (password?.length == 0 && privateKeyImport?.length == 0)
      ? true
      : false;
  const { generateKeypair, getPublicKeyByPk } = useNostr();
  const {
    encryptAndStorePrivateKey,
    storePublicKey,
    retrieveAndDecryptPrivateKey,
    retrievePublicKey,
  } = useLocalstorage();

  /** TODO check if user is already connected with a Nostr private key */
  useEffect(() => {
    const isConnectedUser = async () => {
      try {
        let publicKeyConnected = await retrievePublicKey();

        if (!publicKeyConnected) {
          alert("Please login");
          return;
        } else {
          setIsConnected(true);
          setPublicKey(publicKeyConnected);
        }
      } catch (e) {}
    };

    isConnectedUser();
  }, []);

  /** Create private key
   * Saved it with a password credentials biometrics
   * Add on localstorage
   */
  const handleCreateAccount = async () => {
    if (username?.length == 0 || !username) {
      alert("Enter username to login");
      return;
    }
    if (password?.length == 0 || !password) {
      alert("Enter password");
      return;
    }
    const biometrySupported = await isBiometrySupported();
    // @TODO (biometrySupported) uncomment web mode
    if (biometrySupported || bypassBiometric) {
      // Save credentials with biometric protection
      await saveCredentialsWithBiometry(username, password);
      let credentialsSaved = await generatePassword(username, password);
      // Retrieve credentials with biometric authentication
      const credentials = await getCredentialsWithBiometry();
      if (credentials) {
        /**Generate keypair */
        let { pk, sk, skString } = generateKeypair();

        setPublicKey(pk);
        setPrivateKey(sk);
        await storePublicKey(pk);
        setPrivateKeyReadable(skString);

        /** Save pk in localstorage */
        let encryptedPk = await encryptAndStorePrivateKey(
          sk,
          credentials?.password,
          skString
        );
        let storedPk = await storePublicKey(pk);
      } else if (bypassBiometric) {
        /** @TODO comment web mode */
        /**Generate keypair */
        let { pk, sk, skString } = generateKeypair();
        setPublicKey(pk);
        setPrivateKey(sk);
        setPrivateKeyReadable(skString);
        /** Save pk in localstorage */
        await storePublicKey(pk);
        let encryptedPk = await encryptAndStorePrivateKey(
          sk,
          password,
          skString
        );

        if (encryptedPk) {
          setStep(LoginStep.ACCOUNT_CREATED);
        }
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

  /** Import private key
   * Saved it with a password credentials biometrics
   * Add on localstorage
   *
   */
  const handleImportPrivateKey = async () => {
    if (privateKeyImport?.length == 0) {
      alert("Enter a key to import");
      return;
    }
    if (password?.length == 0) {
      alert("Enter a password");
      return;
    }
    const biometrySupported = await isBiometrySupported();
    // @TODO (biometrySupported) uncomment web mode
    // BY PASS in dev web
    if (biometrySupported || bypassBiometric) {
      // Save credentials with biometric protection
      await saveCredentialsWithBiometry(username, password);
      let credentialsSaved = await generatePassword(username, password);
      // Retrieve credentials with biometric authentication
      const credentials = await getCredentialsWithBiometry();
      if (credentials) {
        /** @TODO comment web mode */
        // let keypairImport = await base64ToUint8Array(privateKeyImport);
        let keypairImport = await utf8StringToUint8Array(privateKeyImport);
        let publicKey = getPublicKeyByPk(keypairImport);
        setPublicKey(publicKey);

        /** Save pk in localstorage */
        let encryptedPk = await encryptAndStorePrivateKey(
          keypairImport,
          password,
          privateKeyImport
        );

        if (privateKeyImport && keypairImport) {
          setPrivateKeyReadable(privateKeyImport);
          setIsSkipAvailable(true);
          setStep(LoginStep.EXPORTED_ACCOUNT);
          await storePublicKey(publicKey);
        }
        // let storedPk = await storePublicKey(pk);
      } else if (bypassBiometric) {
        /** @TODO comment web mode */
        // let keypairImport = await base64ToUint8Array(privateKeyImport);
        let keypairImport = await utf8StringToUint8Array(privateKeyImport);
        let publicKey = getPublicKeyByPk(keypairImport);
        setPublicKey(publicKey);
        /** Save pk in localstorage */
        let encryptedPk = await encryptAndStorePrivateKey(
          keypairImport,
          password,
          privateKeyImport
        );

        if (privateKeyImport && keypairImport) {
          setPrivateKeyReadable(privateKeyImport);
          setIsSkipAvailable(true);
          await storePublicKey(publicKey);
          setStep(LoginStep.EXPORTED_ACCOUNT);
        }

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
    <ScreenContainer style={styles.container}>
      <Image
        source={require("../../../assets/joyboy-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {step == LoginStep.HOME && (
        <View style={styles.inputContainer}>
          {/* <Text>Enter your login for Nostr</Text> */}
          <TextInput
            style={[styles.input]}
            placeholderTextColor="#888"
            placeholder="Enter your login key"
            value={privateKeyImport}
            onChangeText={setImportPrivateKey}
          />
          <TextInput
            style={[styles.input]}
            placeholder="Enter a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <ImportButton
            onPress={handleImportPrivateKey}
            style={{
              paddingVertical: 8,
              width: Platform.OS != "android" ? "100%" : 100,
              backgroundColor: isImportDisabled && "gray",
            }}
            disabled={isImportDisabled}
          >
            <Typography variant="ts19m">Login</Typography>
          </ImportButton>
        </View>
      )}
      {step == LoginStep.EXPORTED_ACCOUNT && (
        <View
          style={{
            paddingHorizontal: 12,
            gap: 4,
            padding: 8,
            width: 230,
          }}
        >
          {publicKey && (
            <Text style={styles.text} selectable={true}>
              {publicKey}
            </Text>
          )}

          {privateKeyReadable && (
            <>
              <Text style={styles.text} selectable={true}>
                {privateKeyReadable}
              </Text>
            </>
          )}
        </View>
      )}

      {step != LoginStep.CREATE_ACCOUNT &&
        step != LoginStep.EXPORTED_ACCOUNT && (
          <View style={styles.inputContainer}>
            <CreateAccountButton
              onPress={() => setStep(LoginStep.CREATE_ACCOUNT)}
              style={{
                paddingVertical: 8,
                marginVertical: 8,
                width: Platform.OS != "android" ? "100%" : 100,
              }}
            >
              <Typography variant="ts19m">Create an account</Typography>
            </CreateAccountButton>
          </View>
        )}

      <View style={styles.inputContainer}>
        <View>
          {step == LoginStep.CREATE_ACCOUNT && (
            <View>
              <TextInput
                style={[styles.input]}
                placeholderTextColor="#888"
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

              <LoginButton
                onPress={handleCreateAccount}
                style={{
                  paddingVertical: 8,
                  marginVertical: 8,
                }}
              >
                <Typography variant="ts19m">Create</Typography>
              </LoginButton>

              <CreateAccountButton
                onPress={() => setStep(LoginStep.HOME)}
                style={{
                  paddingVertical: 8,
                  marginVertical: 8,
                  width: Platform.OS != "android" ? "100%" : 100,
                }}
                disabled={privateKeyImport?.length == 0}
              >
                <Typography variant="ts19m">
                  Try login with an account
                </Typography>
              </CreateAccountButton>

              <View
                style={{
                  paddingHorizontal: 12,
                  gap: 4,
                  padding: 8,
                  width: 230,
                }}
              >
                {publicKey && (
                  <Text style={styles.text} selectable={true}>
                    {publicKey}
                  </Text>
                )}

                {privateKey && (
                  <>
                    <Text style={styles.text} selectable={true}>
                      {Uint8Array.from(privateKey)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}

          {step == LoginStep.ACCOUNT_CREATED && (
            <View
              style={{
                paddingHorizontal: 12,
                gap: 4,
                padding: 8,
                width: 230,
              }}
            >
              {publicKey && (
                <Text style={styles.text} selectable={true}>
                  {publicKey}
                </Text>
              )}

              {privateKeyReadable && (
                <>
                  <Text style={styles.text} selectable={true}>
                    {privateKeyReadable}
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
      </View>

      {isConnected && (
        <View
          style={{
            paddingHorizontal: 12,
            gap: 4,
            padding: 8,
            width: 230,
          }}
        >
          <Typography>You have a connected account.</Typography>
          {publicKey && (
            <Text style={styles.text} selectable={true}>
              {publicKey}
            </Text>
          )}
        </View>
      )}

      {isSkipAvailable && (
        <SkipButton onPress={login}>
          <Typography variant="ts19m" style={styles.textButton}>
            Skip
          </Typography>
        </SkipButton>
      )}
    </ScreenContainer>
  );
}

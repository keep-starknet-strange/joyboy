import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import CryptoJS from "react-native-crypto-js";
// import CryptoJS from "crypto-js";

export const useLocalstorage = () => {
  // Convert Uint8Array to Base64 string
  const uint8ArrayToBase64 = (uint8Array: Uint8Array) => {
    return btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
  };

  // Convert Base64 string to Uint8Array
  const base64ToUint8Array = (base64: string) => {
    return new Uint8Array(
      atob(base64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
  };

  // Function to encrypt and store the private key
  const storePublicKey = async (publicKey: string) => {
    try {
      // Store the public key using AsyncStorage
      await AsyncStorage.setItem("publicKey", publicKey);
      return publicKey;
    } catch (e) {
      console.log("Error encryptAndStorePrivateKey", e);
    }
  };

  // Function to generate a random symmetric key

  // Function to encrypt and store the private key
  const encryptAndStorePrivateKey = async (
    privateKey: Uint8Array,
    password: string
  ) => {
    try {
      const base64Key = uint8ArrayToBase64(privateKey);
      const encryptedPrivateKey = CryptoJS.AES.encrypt(
        base64Key,
        password
      ).toString();

      await AsyncStorage.setItem("symmetricKey", password);

      // Store the encrypted private key using AsyncStorage
      await AsyncStorage.setItem("encryptedPrivateKey", encryptedPrivateKey);

      return encryptedPrivateKey;
    } catch (e) {
      console.log("Error encryptAndStorePrivateKey", e);
    }
  };

  // Function to retrieve and decrypt the private key
  const retrieveAndDecryptPrivateKey = async () => {
    try {
      // Retrieve the symmetric key from AsyncStorage
      const symmetricKey = await AsyncStorage.getItem("symmetricKey");
      console.log("symetricKey", symmetricKey);
      if (!symmetricKey) {
        throw new Error("Symmetric key not found");
      }

      // Retrieve the encrypted private key from AsyncStorage
      const encryptedPrivateKey = await AsyncStorage.getItem(
        "encryptedPrivateKey"
      );
      if (!encryptedPrivateKey) {
        throw new Error("Encrypted private key not found");
      }

      const decryptedPrivateKey = CryptoJS.AES.decrypt(
        encryptedPrivateKey,
        symmetricKey
      )?.toString(CryptoJS.enc.Utf8);
      const uint8Array = base64ToUint8Array(decryptedPrivateKey);
      return uint8Array;
    } catch (e) {
      console.log("Error retrieveAndDecryptPrivateKey", e);
      return undefined;
    }
  };

  //   // Usage example
  //   const privateKey = "YOUR_PRIVATE_KEY";
  //   encryptAndStorePrivateKey(privateKey);

  //   // Later, when you need to retrieve the private key
  //   retrieveAndDecryptPrivateKey().then((decryptedPrivateKey) => {
  //     console.log(decryptedPrivateKey);
  //   });

  return {
    retrieveAndDecryptPrivateKey,
    encryptAndStorePrivateKey,
    storePublicKey,
    base64ToUint8Array,
    uint8ArrayToBase64,
    // generateSymmetricKey,
  };
};

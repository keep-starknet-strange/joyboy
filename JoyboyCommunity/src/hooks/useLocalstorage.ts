import { encrypt, decrypt } from "crypto-js"; // Import encryption functions from crypto-js 
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage 
// const CryptoJS = require("crypto-js"); 
import * as CryptoJS from "crypto-js"; 
 
export const useLocalstorage = () => { 
  // Function to generate a random symmetric key 
 
  // Function to encrypt and store the private key 
  const encryptAndStorePrivateKey = async (privateKey, password) => { 
    try { 
      const encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, password).toString(); 
 
      // Store the Password/symmetric key securely using AsyncStorage 
      await AsyncStorage.setItem("symmetricKey", password); 
 
      // Store the encrypted private key using AsyncStorage 
      await AsyncStorage.setItem("encryptedPrivateKey", encryptedPrivateKey); 
 
      return encryptedPrivateKey 
    } catch (e) { 
      console.log("Error encryptAndStorePrivateKey", e); 
    } 
  }; 
 
  // Function to retrieve and decrypt the private key 
  const retrieveAndDecryptPrivateKey = async () => { 
    try { 
      // Retrieve the symmetric key from AsyncStorage 
      const symmetricKey = await AsyncStorage.getItem("symmetricKey"); 
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
 
      // Decrypt the private key using the symmetric key 
    //   const decryptedPrivateKey = decrypt( 
    //     encryptedPrivateKey, 
    //     symmetricKey 
    //   ).toString(); 
 
      const decryptedPrivateKey = CryptoJS.AES.encrypt(encryptedPrivateKey, symmetricKey).toString(); 
 
      return decryptedPrivateKey; 
    } catch (e) { 
      console.log("Error retrieveAndDecryptPrivateKey", e); 
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
    // generateSymmetricKey, 
  }; 
};
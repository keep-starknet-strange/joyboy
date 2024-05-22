import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import CryptoJS from 'react-native-crypto-js';

import {base64ToUint8Array, uint8ArrayToBase64, utf8StringToUint8Array} from '../utils/format';

export const useLocalstorage = () => {
  // Function to encrypt and store the private key
  const storePublicKey = async (publicKey: string) => {
    try {
      // Store the public key using AsyncStorage
      await AsyncStorage.setItem('publicKey', publicKey);
      return publicKey;
    } catch (e) {
      console.log('Error encryptAndStorePrivateKey', e);
    }
  };

  /**
   * / Function to encrypt and store the private key 
  // as a String of Uint8Array not encoded
   * @param privateKey 
   * @param password 
   * @param readablePrivateKey 
   * @returns 
   */
  const encryptAndStorePrivateKey = async (
    privateKey: Uint8Array,
    password: string,
    readablePrivateKey?: string,
  ) => {
    try {
      const base64Key = uint8ArrayToBase64(privateKey);

      const encryptedPrivateKeyArray = CryptoJS.AES.encrypt(base64Key, password).toString();

      await AsyncStorage.setItem('symmetricKey', password);

      // Store the encrypted private key using AsyncStorage
      await AsyncStorage.setItem('encryptedPrivateKeyArray', encryptedPrivateKeyArray);

      if (readablePrivateKey) {
        const readablePk = CryptoJS.AES.encrypt(readablePrivateKey, password).toString();
        await AsyncStorage.setItem('encryptedPrivateKeyUtf8', readablePk);
      }

      return encryptedPrivateKeyArray;
    } catch (e) {
      console.log('Error encryptAndStorePrivateKey', e);
    }
  };

  // Function to retrieve and decrypt the private key
  const retrieveAndDecryptPrivateKey = async () => {
    try {
      // Retrieve the symmetric key from AsyncStorage
      const symmetricKey = await AsyncStorage.getItem('symmetricKey');
      console.log('symetricKey', symmetricKey);
      if (!symmetricKey) {
        throw new Error('Symmetric key not found');
      }

      // Retrieve the encrypted private key from AsyncStorage
      const encryptedPrivateKeyArray = await AsyncStorage.getItem('encryptedPrivateKeyArray');
      if (!encryptedPrivateKeyArray) {
        throw new Error('Encrypted private key not found');
      }

      const decryptedPrivateKey = CryptoJS.AES.decrypt(
        encryptedPrivateKeyArray,
        symmetricKey,
      )?.toString(CryptoJS.enc.Utf8);
      const uint8Array = base64ToUint8Array(decryptedPrivateKey);

      const encryptedPrivateKeyUtf8 = await AsyncStorage.getItem('encryptedPrivateKeyUtf8');

      if (!encryptedPrivateKeyUtf8) {
        return {array: uint8Array};
      }
      const decryptedPrivateKeyReadable = CryptoJS.AES.decrypt(
        encryptedPrivateKeyUtf8,
        symmetricKey,
      )?.toString(CryptoJS.enc.Utf8);
      const privateKey = utf8StringToUint8Array(decryptedPrivateKey);

      return {array: uint8Array, privateKey};
    } catch (e) {
      console.log('Error retrieveAndDecryptPrivateKey', e);
      return {array: undefined, privateKey: undefined};
    }
  };

  // Function to retrieve and decrypt the private key
  const retrievePublicKey = async () => {
    try {
      // Retrieve the symmetric key from AsyncStorage
      const publicKey = await AsyncStorage.getItem('publicKey');
      if (!publicKey) {
        return undefined;
      }
      return publicKey;
    } catch (e) {
      console.log('Error retrievePublicKey', e);
      return undefined;
    }
  };

  return {
    retrieveAndDecryptPrivateKey,
    encryptAndStorePrivateKey,
    storePublicKey,
    retrievePublicKey,
  };
};

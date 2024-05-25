import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import {Platform} from 'react-native';

import {pbkdf2Decrypt, pbkdf2Encrypt, PBKDF2EncryptedObject} from './encryption';

const isSecureStoreAvailable = Platform.OS === 'android' || Platform.OS === 'ios';

export const storePublicKey = async (publicKey: string) => {
  if (isSecureStoreAvailable) {
    return SecureStore.setItemAsync('publicKey', publicKey);
  }

  return AsyncStorage.setItem('publicKey', publicKey);
};

export const retrievePublicKey = async (): Promise<string | null> => {
  if (isSecureStoreAvailable) {
    return SecureStore.getItemAsync('publicKey');
  }

  return AsyncStorage.getItem('publicKey');
};

export const storePrivateKey = async (privateKeyHex: string, password: string) => {
  try {
    const encryptedPrivateKey = JSON.stringify(pbkdf2Encrypt(privateKeyHex, password));

    if (isSecureStoreAvailable) {
      await SecureStore.setItemAsync('encryptedPrivateKey', encryptedPrivateKey);
    } else {
      await AsyncStorage.setItem('encryptedPrivateKey', encryptedPrivateKey);
    }

    return encryptedPrivateKey;
  } catch (error) {
    // We shouldn't throw the original error for security reasons
    throw new Error('Error storing private key');
  }
};

export const retrieveAndDecryptPrivateKey = async (
  password: string,
): Promise<false | Uint8Array> => {
  try {
    const encryptedPrivateKey = isSecureStoreAvailable
      ? await SecureStore.getItemAsync('encryptedPrivateKey')
      : await AsyncStorage.getItem('encryptedPrivateKey');

    if (!encryptedPrivateKey) return false;

    let parsedEncryptedPrivateKey: PBKDF2EncryptedObject;
    try {
      parsedEncryptedPrivateKey = JSON.parse(encryptedPrivateKey);

      if (!('data' in parsedEncryptedPrivateKey)) throw new Error();
    } catch (e) {
      // If the encrypted private key is not in the expected format, we should remove it
      await AsyncStorage.removeItem('encryptedPrivateKey');
      return false;
    }

    const decryptedPrivateKey = pbkdf2Decrypt(parsedEncryptedPrivateKey, password);
    const privateKey = new Uint8Array(decryptedPrivateKey);

    return privateKey;
  } catch (e) {
    // We shouldn't throw the original error for security reasons
    throw new Error('Error retrieving and decrypting private key');
  }
};

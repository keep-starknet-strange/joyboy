import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoES from 'crypto-es';
import * as SecureStore from 'expo-secure-store';
import {Platform} from 'react-native';

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
    const encryptedPrivateKey = CryptoES.AES.encrypt(privateKeyHex, password).toString();

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

export const retrieveAndDecryptPrivateKey = async (password: string): Promise<Uint8Array> => {
  try {
    const encryptedPrivateKey = isSecureStoreAvailable
      ? await SecureStore.getItemAsync('encryptedPrivateKey')
      : await AsyncStorage.getItem('encryptedPrivateKey');
    if (!encryptedPrivateKey) throw new Error('Encrypted private key not found');

    const decryptedPrivateKey = CryptoES.AES.decrypt(encryptedPrivateKey, password)?.toString(
      CryptoES.enc.Utf8,
    );
    const privateKey = new Uint8Array(Buffer.from(decryptedPrivateKey, 'base64'));

    return privateKey;
  } catch (e) {
    // We shouldn't throw the original error for security reasons
    throw new Error('Error retrieving and decrypting private key');
  }
};

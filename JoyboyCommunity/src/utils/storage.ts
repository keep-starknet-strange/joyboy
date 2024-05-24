import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoES from 'crypto-es';

export const storePublicKey = async (publicKey: string) => {
  return AsyncStorage.setItem('publicKey', publicKey);
};

export const retrievePublicKey = async (): Promise<string | null> => {
  return AsyncStorage.getItem('publicKey');
};

export const storePrivateKey = async (privateKeyHex: string, password: string) => {
  try {
    const encryptedPrivateKey = CryptoES.AES.encrypt(privateKeyHex, password).toString();

    await AsyncStorage.setItem('encryptedPrivateKey', encryptedPrivateKey);

    return encryptedPrivateKey;
  } catch (error) {
    // We shouldn't throw the original error for security reasons
    throw new Error('Error storing private key');
  }
};

export const retrieveAndDecryptPrivateKey = async (password: string): Promise<Uint8Array> => {
  try {
    const encryptedPrivateKey = await AsyncStorage.getItem('encryptedPrivateKey');
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

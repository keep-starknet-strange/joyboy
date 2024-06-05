import {secp256k1} from '@noble/curves/secp256k1';
import {getRandomBytes} from 'expo-crypto';

export const generateRandomKeypair = () => {
  try {
    const privateKey = getRandomBytes(32);
    const privateKeyHex = Buffer.from(privateKey).toString('hex');

    const publicKey = secp256k1.getPublicKey(privateKeyHex);
    const publicKeyHex = Buffer.from(publicKey).toString('hex');

    return {
      privateKey: privateKeyHex,
      publicKey: publicKeyHex,
    };
  } catch (error) {
    // We shouldn't throw the original error for security reasons
    throw new Error('Failed to generate keypair');
  }
};

export const getPublicKeyFromSecret = (privateKey: string) => {
  try {
    const publicKey = secp256k1.getPublicKey(privateKey);
    return Buffer.from(publicKey).toString('hex');
  } catch (error) {
    // We shouldn't throw the original error for security reasons
    throw new Error('Failed to get public key from secret key');
  }
};

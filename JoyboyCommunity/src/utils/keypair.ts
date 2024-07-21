import {schnorr} from '@noble/curves/secp256k1';
import {getRandomBytes} from 'expo-crypto';

export const generateRandomKeypair = () => {
  try {
    const privateKey = getRandomBytes(32);
    const privateKeyHex = Buffer.from(privateKey).toString('hex');

    const publicKey = schnorr.getPublicKey(privateKeyHex);
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
    const publicKey = schnorr.getPublicKey(privateKey);
    return Buffer.from(publicKey).toString('hex');
  } catch (error) {
    // We shouldn't throw the original error for security reasons
    throw new Error('Failed to get public key from secret key');
  }
};

export const isValidNostrPrivateKey = (key: string): boolean =>  {
  // Check if the string is exactly 64 characters long
  if (key.length !== 64) {
    return false;
  }

  // Check if the string contains only hexadecimal characters
  const hexRegex = /^[0-9a-fA-F]+$/;
  if (!hexRegex.test(key)) {
    return false;
  }

  return true;
}

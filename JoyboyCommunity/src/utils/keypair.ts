import {secp256k1} from '@noble/curves/secp256k1';
import {getRandomBytes} from 'expo-crypto';

export const generateRandomKeypair = () => {
  try {
    const secretKey = getRandomBytes(32);
    const secretKeyHex = Buffer.from(secretKey).toString('hex');

    const publicKey = secp256k1.getPublicKey(secretKeyHex);
    const publicKeyHex = Buffer.from(publicKey).toString('hex');

    return {
      secretKey,
      secretKeyHex,
      publicKey: publicKeyHex,
    };
  } catch (error) {
    // We shouldn't throw the original error for security reasons
    throw new Error('Failed to generate keypair');
  }
};

export const getPublicKeyFromSecret = (secretKey: Uint8Array | string) => {
  try {
    const secretKeyHex =
      typeof secretKey === 'string' ? secretKey : Buffer.from(secretKey).toString('hex');

    const publicKey = secp256k1.getPublicKey(secretKeyHex);
    return Buffer.from(publicKey).toString('hex');
  } catch (error) {
    // We shouldn't throw the original error for security reasons
    throw new Error('Failed to get public key from secret key');
  }
};

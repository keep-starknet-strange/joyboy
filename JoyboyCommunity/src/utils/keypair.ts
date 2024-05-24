import {getRandomBytes} from 'expo-crypto';
import {getPublicKey} from 'nostr-tools';

export const generateRandomKeypair = () => {
  try {
    const secretKey = getRandomBytes(32);
    const secretKeyHex = Buffer.from(secretKey).toString('hex');

    const publicKey = getPublicKey(secretKey);

    return {
      secretKey,
      secretKeyHex,
      publicKey,
    };
  } catch (error) {
    // We shouldn't throw the original error for security reasons
    throw new Error('Failed to generate keypair');
  }
};

export const getPublicKeyFromSecret = (secretKey: Uint8Array | string) => {
  try {
    const secretKeyBuffer =
      typeof secretKey === 'string' ? new Uint8Array(Buffer.from(secretKey, 'hex')) : secretKey;

    return getPublicKey(secretKeyBuffer);
  } catch (error) {
    // We shouldn't throw the original error for security reasons
    throw new Error('Failed to get public key from secret key');
  }
};

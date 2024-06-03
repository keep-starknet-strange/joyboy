import CryptoES from 'crypto-es';
import * as Crypto from 'expo-crypto';
import pbkdf2 from 'pbkdf2';

export type PBKDF2EncryptedObject = {
  data: string;
  salt: string;
  iv: string;
};

// TODO: it would be better if we use a native module for pbkdf2
// if we use a native module, we can increase the iterations
const PBKDF2_ITERATIONS = 1_000;

export const pbkdf2Encrypt = (privateKey: string, password: string): PBKDF2EncryptedObject => {
  const salt = Crypto.getRandomBytes(16);

  const key = pbkdf2.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, 'sha256');
  const keyArray = CryptoES.lib.WordArray.create(new Uint8Array(key));

  const iv = Crypto.getRandomBytes(16);
  const ivArray = CryptoES.lib.WordArray.create(iv);

  const encrypted = CryptoES.AES.encrypt(
    Buffer.from(privateKey, 'hex').toString('base64'),
    keyArray,
    {iv: ivArray},
  ).toString();

  return {
    data: encrypted,
    salt: Buffer.from(salt).toString('hex'),
    iv: Buffer.from(iv).toString('hex'),
  };
};

export const pbkdf2Decrypt = (encrypted: PBKDF2EncryptedObject, password: string): Buffer => {
  const salt = Buffer.from(encrypted.salt, 'hex');

  const iv = Buffer.from(encrypted.iv, 'hex');
  const ivArray = CryptoES.lib.WordArray.create(new Uint8Array(iv));

  const key = pbkdf2.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, 'sha256');
  const keyArray = CryptoES.lib.WordArray.create(new Uint8Array(key));

  const decrypted = CryptoES.AES.decrypt(encrypted.data, keyArray, {iv: ivArray}).toString(
    CryptoES.enc.Utf8,
  );
  const data = Buffer.from(decrypted, 'base64');

  return data;
};

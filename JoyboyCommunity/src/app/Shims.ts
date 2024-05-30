import {Buffer} from 'buffer/';
import * as Crypto from 'expo-crypto';

global.Buffer = Buffer as any;

global.crypto = {
  getRandomValues: (buffer: any) => Crypto.getRandomValues(buffer),
  randomUUID: () => Crypto.randomUUID() as any,
  getRandomBytes: (length: number) => Crypto.getRandomBytes(length),
} as any;

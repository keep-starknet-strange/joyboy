import PinataSDK from '@pinata/sdk';

if (!process.env.PINATA_API_KEY) throw new Error('PINATA_API_KEY is not set');
if (!process.env.PINATA_SECRET_API_KEY) throw new Error('PINATA_SECRET_API_KEY is not set');
if (!process.env.IPFS_GATEWAY) throw new Error('IPFS_GATEWAY is not set');

export const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

pinata.testAuthentication();

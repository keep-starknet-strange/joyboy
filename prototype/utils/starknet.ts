import dotenv from "dotenv";
dotenv.config()

import { Account, RpcProvider, ec, stark } from "starknet";
const STARKNET_URL = process.env.RPC_ENDPOINT || "http://127.0.0.1:5050";
console.log(" process.env.RPC_ENDPOINT", process.env.RPC_ENDPOINT)
console.log("STARKNET_URL",STARKNET_URL)
/** @TODO Uncomment to use with your own RPC_ENDPOINT, Sepolia by default */
export const provider = new RpcProvider({nodeUrl:STARKNET_URL});

export const createStarknetWallet = () => {
  try {
    const privateKey = stark.randomAddress();
    console.log("New privateKey=", privateKey);
    const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);
    console.log("publicKey=", starkKeyPub);
    return privateKey;
  } catch (e) {
    return undefined;
  }
};
export function connectToStarknet(nodeUrl?: string) {
  try {
    return new RpcProvider({
      nodeUrl: nodeUrl ?? (process.env.RPC_ENDPOINT as string),
    });
  } catch (e) {}
}

export const connectWallet = (
  accountAddress?: string,
  privateKeyProps?: string
) => {
  try {
    const provider = new RpcProvider({
      nodeUrl: STARKNET_URL as string,
    });
    const privateKey = privateKeyProps ?? (process?.env?.DEV_PK as string);

    const publicKey =
      accountAddress ?? (process.env.DEV_PUBLIC_KEY as string);
    const account = new Account(provider, publicKey, privateKey);

    return account;
  } catch (e) {
    return undefined;
  }
};

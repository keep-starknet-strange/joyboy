import {
  Account,
  json,
  CallData,
  RpcProvider,
  Contract,
  Calldata,
  cairo,
  Uint256,
  uint256,
  Call,
} from "starknet";
import fs from "fs";
import dotenv from "dotenv";
import { TOKENS_ADDRESS } from "../constants";
import { provider } from "./starknet";
import { SocialPayRequest } from "types";
import path from 'path';
dotenv.config();

const STARKNET_URL = process.env.RPC_ENDPOINT || "http://127.0.0.1:5050";
const PATH_TOKEN = path.resolve(__dirname, '../../onchain/target/dev/ERC20Upgradeable.contract_class.json');
const PATH_TOKEN_COMPILED = path.resolve(__dirname, '../../onchain/target/dev/ERC20Upgradeable.compiled_contract_class.json');

/** @TODO spec need to be discuss. This function serve as an exemple */
export const createToken = async () => {
  try {
    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;

    // Devnet account
    const account0 = new Account(provider, accountAddress0, privateKey0, "1");

    // declare the contract
    const compiledContract = json.parse(
      fs.readFileSync(PATH_TOKEN).toString("ascii")
    );
    const compiledCasm = json.parse(
      fs.readFileSync(PATH_TOKEN_COMPILED).toString("ascii")
    );
  
    console.log("declareIfNot");

    const declareIfNot = await account0.declareIfNot({
      contract: compiledContract,
      casm: compiledCasm,
    });
    console.log("declareIfNot", declareIfNot);

    const contractConstructor: Calldata = CallData.compile({
      symbol: cairo.felt("JOY"),
      name: cairo.felt("JOYBOY"),
      total_supply: cairo.uint256(10000),
      recipient: account0?.address,
    });

    let ERC20_HASH =
      declareIfNot?.class_hash ?? (process.env.TOKEN_CLASS_HASH as string);
    const deployResponse = await account0.deployContract({
      classHash: ERC20_HASH,
      constructorCalldata: contractConstructor
    });

    let tx = await account0?.waitForTransaction(
      deployResponse?.transaction_hash
    );
    console.log("tx create contract", tx);

    // // Connect the new contract instance:
    const myToken = new Contract(
      compiledContract.abi,
      deployResponse.contract_address,
      provider
    );
    return myToken;
  } catch (error) {
    console.log("Error createToken= ", error);
  }
};

export const transferToken = async (
  account: Account,
  recipient: string,
  tokenAddress?: string,
  amount?: number
) => {
  try {
    let token = await getToken(tokenAddress ?? TOKENS_ADDRESS.SEPOLIA.TEST);

    token?.connect(account);
    console.log("transfer token");
    let balanceInitial = await token?.balanceOf(account.address);
    console.log("account0 has a balance of:", balanceInitial);
    // Execute tx transfer of 1 tokens to account 1
    console.log(`Invoke Tx - Transfer 1 tokens to erc20 contract...`);
    const toTransferTk: Uint256 = cairo.uint256(1 * 10 * 18);
    let decimals = 18;
    let total_amount_float = amount ?? 0.01;

    let total_amount: Uint256 | undefined;
    const total_amount_nb = total_amount_float * 10 ** Number(decimals);

    if (Number.isInteger(total_amount_nb)) {
      total_amount = cairo.uint256(total_amount_nb);
    } else if (!Number.isInteger(total_amount_nb)) {
      total_amount = uint256.bnToUint256(BigInt(total_amount_nb));
    }

    const transferCall: Call | undefined = token?.populate("transfer", {
      recipient: recipient,
      amount: total_amount ?? toTransferTk,
    });
    console.log("transfer call", transferCall);
    if (transferCall) {
      let estimateFee = await account?.estimateFee(transferCall);
      console.log("estimateFee", estimateFee);
      const { transaction_hash: transferTxHash } = await account.execute(
        transferCall,
        undefined,
        {
          // maxFee:estimateFee?.suggestedMaxFee,
          // skipValidate: true,
        }
      );
      console.log("transferTxHash", transferTxHash);
      let tx = await provider.waitForTransaction(transferTxHash);
      console.log("transfer done");
    }
  } catch (e) {
    console.log("transferToken Error: ", e);
  }
};
export const getToken = async (tokenAddress: string, classHash?: string) => {
  try {
    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;
    const { abi: testAbi } = await provider.getClassAt(tokenAddress);
    const account = new Account(provider, accountAddress0, privateKey0, "1");
    const token = new Contract(testAbi, tokenAddress, provider);
    return token;
  } catch (error) {
    console.log("Error createToken= ", error);
  }
};


/** @TODO determine paymaster master specs to send the TX */
export const prepareAndConnectContract = async (
  addressUser: string,
  account:Account,
) => {
  // read abi of Test contract
  const { abi: testAbi } = await provider.getClassAt(addressUser);

  const token = new Contract(testAbi, addressUser, provider);
  // Connect account with the contract
  token.connect(account);
  return token;
};

export const handleTransferRequest = async (
  socialPay: Contract,
  socialRequest: SocialPayRequest
) => {
  const provider = new RpcProvider({ nodeUrl: STARKNET_URL });
  const myCall = socialPay.populate("handle_transfer", [socialRequest]);
  const res = await socialPay.handle_transfer(myCall.calldata);
  await provider.waitForTransaction(res.transaction_hash);
  const bal2 = await socialPay.get_balance();
  console.log("Final balance =", bal2.res.toString());
};

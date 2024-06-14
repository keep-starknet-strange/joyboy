import {
  Account,
  json,
  hash,
  CallData,
  Contract,
  cairo,
  uint256,
} from "starknet";
import fs from "fs";
import dotenv from "dotenv";
import { nostrPubkeyToUint256 } from "./format";
import { provider } from "./starknet";
import { transferToken } from "./token";
import path from "path";

dotenv.config();
const PATH_SOCIAL_ACCOUNT = path.resolve(
  __dirname,
  "../../onchain/target/dev/joyboy_DepositEscrow.contract_class.json"
);
const PATH_SOCIAL_ACCOUNT_COMPILED = path.resolve(
  __dirname,
  "../../onchain/target/dev/joyboy_DepositEscrow.compiled_contract_class.json"
);

/** @TODO spec need to be discuss. This function serve as an exemple */
export const createEscrowAccount = async () => {
  try {
    // initialize existing predeployed account 0 of Devnet
    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;

    // Devnet or Sepolia account
    const account0 = new Account(provider, accountAddress0, privateKey0, "1");
    let EscrowClassHash = process.env.ESCROW_CLASS_HASH as string;

    const compiledSierraAAaccount = json.parse(
      fs.readFileSync(PATH_SOCIAL_ACCOUNT).toString("ascii")
    );
    const compiledAACasm = json.parse(
      fs.readFileSync(PATH_SOCIAL_ACCOUNT_COMPILED).toString("ascii")
    );
    /** Get class hash account */

    // const ch = hash.computeSierraContractClassHash(compiledSierraAAaccount);
    // const compCH = hash.computeCompiledClassHash(compiledAACasm);
    // let pubkeyUint = pubkeyToUint256(nostrPublicKey);

    //Devnet
    // //  fund account address before account creation
    // const { data: answer } = await axios.post(
    //   "http://127.0.0.1:5050/mint",
    //   {
    //     address: AAcontractAddress,
    //     amount: 50_000_000_000_000_000_000,
    //     lite: true,
    //   },
    //   { headers: { "Content-Type": "application/json" } }
    // );
    // console.log("Answer mint =", answer);

    // deploy account

    // const AAaccount = new Account(provider, AAcontractAddress, AAprivateKey);
    /** @description uncomment this to declare your accout */
    // console.log("declare account");
    console.log("try declare account");
    const declareResponse = await account0.declare({
      contract: compiledSierraAAaccount,
      casm: compiledAACasm,
    });
    console.log("Declare deploy", declareResponse?.transaction_hash);
    await provider.waitForTransaction(declareResponse?.transaction_hash);
    const contractClassHash = declareResponse.class_hash;
    EscrowClassHash = contractClassHash;


    const nonce = await account0?.getNonce();
    console.log("nonce", nonce);

    const { transaction_hash, contract_address } =
      await account0.deployContract({
        classHash: EscrowClassHash,
        constructorCalldata: [],
      });

    console.log("transaction_hash", transaction_hash);
    console.log("contract_address", contract_address);
    let tx = await account0?.waitForTransaction(transaction_hash);

    console.log("Tx deploy", tx);
    await provider.waitForTransaction(transaction_hash);
    console.log(
      "✅ New contract Social created.\n   address =",
      contract_address
    );

    // const contract = new Contract(compiledSierraAAaccount, contract_address, account0)
    return {
      contract_address,
      tx,
      // contract
    };
  } catch (error) {
    console.log("Error createEscrowAccount= ", error);
  }
};


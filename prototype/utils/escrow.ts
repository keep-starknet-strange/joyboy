import {
  Account,
  json,
  hash,
  CallData,
  Contract,
  cairo,
  uint256,
  byteArray,
} from "starknet";
import fs from "fs";
import dotenv from "dotenv";
import { nostrPubkeyToUint256 } from "./format";
import { provider } from "./starknet";
import { transferToken } from "./token";
import path from "path";
import { finalizeEvent } from "nostr-tools";

dotenv.config();
const PATH_SOCIAL_ACCOUNT = path.resolve(
  __dirname,
  "../../onchain/target/dev/joyboy_DepositEscrow.contract_class.json"
);
const PATH_SOCIAL_ACCOUNT_COMPILED = path.resolve(
  __dirname,
  "../../onchain/target/dev/joyboy_DepositEscrow.compiled_contract_class.json"
);

/** @TODO spec need to be discuss. This function serve as an example */
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
    /** @description uncomment this to declare your account */
    // console.log("declare account");

    if(process.env.REDECLARE_ACCOUNT) {
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
    }

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
      "✅ New contract Escrow created.\n   address =",
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


export const deposit = async (props: {
  escrow: Contract,
  account: Account,
  amount: number,
  tokenAddress: string,
  timelock: number,
  alicePublicKey: string,

}) => {
  try {
    const { escrow, account, amount, tokenAddress, timelock, alicePublicKey } = props
    const depositParams = {
      amount: uint256.bnToUint256(BigInt("0x"+amount)), // amount float. cairo.uint256(amount) for Int
      // Float need to be convert with bnToUint

      token_address: tokenAddress, // token address
      nostr_recipient: cairo.uint256(BigInt("0x" + alicePublicKey)),
      timelock: timelock,
    };
    console.log("depositParams", depositParams);
    const tx = await account.execute({
      contractAddress: escrow?.address,
      calldata: depositParams,
      entrypoint: "deposit",
    });

    await account.waitForTransaction(tx.transaction_hash)

    return tx;

  } catch (e) {
    console.log("Error deposit", e)

  }



}

export const claimDeposit = async (props: {
  escrow: Contract,
  account: Account,
  depositId: number,
  content: string,
  timestamp: number,
  alicePublicKey: string,
  privateKey: any,
}
) => {
  try {
    const { escrow, account, depositId, content, timestamp, alicePublicKey, privateKey } = props
    const event = finalizeEvent(
      {
        kind: 1,
        tags: [],
        content: content,
        created_at: timestamp,
      },
      privateKey
    );

    console.log(
      "event",
      event
    );
    const signature = event.sig;
    const signatureR = "0x" + signature.slice(0, signature.length / 2);
    const signatureS = "0x" + signature.slice(signature.length / 2);
    console.log("signature", signature);
    console.log("signatureR", signatureR);
    console.log("signatureS", signatureS);
    let public_key = cairo.uint256(BigInt("0x" + alicePublicKey))
    // expect(depositCurrentId?.recipient).to.eq(BigInt("0x" + alicePublicKey))
    const claimParams = {
      public_key: public_key,
      created_at: timestamp,
      kind: 1,
      tags: byteArray.byteArrayFromString("[]"), // tags
      // content: content, // currentId in felt
      content: cairo.felt(depositId),
      signature: {
        r: cairo.uint256(signatureR),
        s: cairo.uint256(signatureS),
      },
    };
    console.log("claimParams", claimParams);
    const tx = await account.execute({
      contractAddress: escrow?.address,
      calldata: claimParams,
      entrypoint: "claim",
    });

    await account.waitForTransaction(tx.transaction_hash)

    return tx;

  } catch (e) {
    console.log("Error claim deposit", e)

  }

}

export const cancel = async (props: {
  escrow: Contract,
  account: Account,
  depositId: number,
}) => {
  try {
    const { escrow, account, depositId } = props
    const cancelParams = {
      deposit_id: cairo.felt(depositId),
    };
    console.log("cancelParams", cancelParams);
    const tx = await account.execute({
      contractAddress: escrow?.address,
      calldata: cancelParams,
      entrypoint: "cancel",
    });
    await account.waitForTransaction(tx.transaction_hash)
    return tx;
  } catch (e) {
    console.log("Error cancel", e)
  }
}

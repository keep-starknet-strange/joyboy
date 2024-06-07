import { Account, json, hash, CallData, Contract, cairo } from "starknet";
import fs from "fs";
import dotenv from "dotenv";
import { nostrPubkeyToUint256 } from "./format";
import { provider } from "./starknet";
import { transferToken } from "./token";
import path from "path";

dotenv.config();
const PATH_SOCIAL_ACCOUNT = path.resolve(
  __dirname,
  "../../onchain/target/dev/joyboy_SocialAccount.contract_class.json"
);
const PATH_SOCIAL_ACCOUNT_COMPILED = path.resolve(
  __dirname,
  "../../onchain/target/dev/joyboy_SocialAccount.compiled_contract_class.json"
);

/** @TODO spec need to be discuss. This function serve as an exemple */
export const createSocialContract = async (nostrPublicKey: string) => {
  try {
    // initialize existing predeployed account 0 of Devnet
    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;

    // Devnet or Sepolia account
    const account0 = new Account(provider, accountAddress0, privateKey0, "1");
    let AAaccountClassHash = process.env.ACCOUNT_CLASS_HASH as string;

    // declare the contract

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

    let nostPubkeyUint = nostrPubkeyToUint256(nostrPublicKey?.toString());
    let isUint = cairo.isTypeUint256(nostPubkeyUint?.toString());
    console.log("isUint", isUint);
    // Example usage
    const hexString = nostrPublicKey; // Replace with actual hex string
    // console.log("nostPubkeyUint", nostPubkeyUint);
    const AAaccountConstructorCallData = CallData.compile({
      public_key: nostPubkeyUint,
    });
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
    // console.log("try declare account");
    // const declareResponse = await account0.declare({
    //   contract: compiledSierraAAaccount,
    //   casm: compiledAACasm,
    // });
    // console.log("Declare deploy", declareResponse?.transaction_hash);
    // await provider.waitForTransaction(declareResponse?.transaction_hash);
    // const contractClassHash = declareResponse.class_hash;
    // AAaccountClassHash = contractClassHash;
    // console.log("AAaccountClassHash", AAaccountClassHash);

    const testClassHash = AAaccountClassHash;

    const nonce = await account0?.getNonce();
    console.log("nonce", nonce);

    const { transaction_hash, contract_address } =
      await account0.deployContract({
        classHash: AAaccountClassHash,
        constructorCalldata: AAaccountConstructorCallData,
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
    console.log("Error createSocialAccount= ", error);
  }
};

/** @TODO account SNIP-06 to finish.
 * Not finish with the SocialPay abi.
 * spec need to be discuss. This function serve as an exemple */
export const createSocialAccount = async (
  nostrPublicKey: string,
  AAprivateKey: string,
  AAstarkKeyPub: string
) => {
  try {
    // initialize existing predeployed account 0 of Devnet
    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;

    // Devnet account
    const account0 = new Account(provider, accountAddress0, privateKey0, "1");

    let AAaccountClassHash = process.env.ACCOUNT_CLASS_HASH as string;

    // declare the contract

    const compiledSierraAAaccount = json.parse(
      fs.readFileSync(PATH_SOCIAL_ACCOUNT).toString("ascii")
    );
    const compiledAACasm = json.parse(
      fs.readFileSync(PATH_SOCIAL_ACCOUNT_COMPILED).toString("ascii")
    );
    // console.log("compiledAAaccount =", compiledSierraAAaccount);
    /** Get class hash account */

    const ch = hash.computeSierraContractClassHash(compiledSierraAAaccount);

    const compCH = hash.computeCompiledClassHash(compiledAACasm);

    // Example usage
    let nostPubkeyUint = nostrPubkeyToUint256(nostrPublicKey?.toString());

    const AAaccountConstructorCallData = CallData.compile({
      public_key: nostPubkeyUint,
    });
    // Calculate future address of the account
    const AAcontractAddress = hash.calculateContractAddressFromHash(
      AAstarkKeyPub,
      AAaccountClassHash,
      AAaccountConstructorCallData,
      0
    );
    console.log("Precalculated account address=", AAcontractAddress);

    /*** Uncomment to used DEVNET */
    // devnet local
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

    /** @description uncomment this to declare your accout */
    // console.log("declare account");
    // console.log("try declare account")
    // const declareResponse = await account0.declare({
    //   contract: compiledSierraAAaccount,
    //   casm: compiledAACasm,
    // });
    // console.log("declareResponse", declareResponse);

    // const contractClassHash = declareResponse.class_hash;
    // AAaccountClassHash=contractClassHash

    const AAaccount = new Account(provider, AAcontractAddress, AAprivateKey);

    // const estimateDeployAccount = await account0?.estimateAccountDeployFee({
    //   classHash: AAaccountClassHash,
    //   // constructorCalldata: AAaccountConstructorCallData,
    //   // constructorCalldata:[uint256Value],
    //   addressSalt: AAstarkKeyPub,
    // });

    /** Fun your AA Account to deploy*/
    await transferToken(
      account0,
      AAcontractAddress,
      "0x49D36570D4E46F48E99674BD3FCC84644DDD6B96F7C741B1562B82F9E004DC7"
      // "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
    );

    const nonce = await account0?.getNonce();
    console.log("nonce", nonce);

    const { transaction_hash, contract_address } =
      await AAaccount.deployAccount(
        // await account0.deployAccount(
        {
          classHash: AAaccountClassHash,
          constructorCalldata: AAaccountConstructorCallData,
          addressSalt: AAstarkKeyPub,
        }
        // {
        //   // maxFee: estimateDeployAccount?.suggestedMaxFee * BigInt(2),
        //   // maxFee: estimateDeployAccount?.suggestedMaxFee,
        //   // nonce: nonceAA,
        //   nonce: nonce,

        // }
      );

    console.log("transaction_hash", transaction_hash);
    console.log("contract_address", contract_address);

    let tx = await account0?.waitForTransaction(transaction_hash);
    console.log("Tx deploy", tx);

    return {
      privateKey: AAprivateKey,
      contract_address,
      tx,
    };
  } catch (error) {
    console.log("Error createSocialAccount= ", error);
  }
};

/** @TODO determine paymaster master specs to send the TX */
export const prepareAndConnectContract = async (
  // addressUser: string,
  contractAddress: string,
  account: Account,
  privateKeyProps?: string
) => {
  // read abi of Test contract
  const { abi: testAbi } = await provider.getClassAt(contractAddress);
  const socialPay = new Contract(testAbi, contractAddress, provider);
  // Connect account with the contract
  socialPay.connect(account);
  return socialPay;
};

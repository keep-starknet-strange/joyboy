import {
  connectToStarknet,
  createStarknetWallet,
  provider,
} from "../utils/starknet";
import { expect } from "chai";
import { generateKeypair, sendEvent } from "../utils/nostr";

import {
  createSocialAccount,
  createSocialContract,
  prepareAndConnectContract,
} from "../utils/social_account";
import { createToken, getToken, transferToken } from "../utils/token";
import { Account, byteArray, cairo, uint256 } from "starknet";
import { SocialPayRequest } from "types";
import { ACCOUNT_TEST_PROFILE, TOKENS_ADDRESS } from "../constants";
import { stringToUint8Array } from "../utils/format";
import dotenv from "dotenv";
import { finalizeEvent, nip19, serializeEvent } from "nostr-tools";
import { createEscrowAccount } from "../utils/escrow";
dotenv.config();
/** Testing tips flow:
 *
 */
describe("Escrow End to end test", () => {
  it("Deploy Escrow Deposit and Claim", async function () {
    this.timeout(0); // Disable timeout for this test

    // const resp = await provider.getSpecVersion();
    // console.log("rpc version =", resp);
    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;

    const account = new Account(provider, accountAddress0, privateKey0, "1");
    /*** Init account
     * @description
     * Get both account for Bob & Alice
     * Send request of account bob to alice
     ***/

    /**  Generate keypair for both account*/
    // Bob nostr account
    // let { privateKey: pkBob, publicKey: bobPublicKey } = generateKeypair();

    let pkBob = stringToUint8Array(ACCOUNT_TEST_PROFILE?.bob?.nostrPrivateKey);
    const bobPublicKey = ACCOUNT_TEST_PROFILE?.bob?.nostrPk;
    console.log("privateKey Bob", new Buffer(pkBob).toString("hex"));
    console.log("bobPublicKey", bobPublicKey);

    /** @TODO Alice account key */
    // Nostr account
    // let { privateKey: pkAlice, publicKey: alicePublicKey } = generateKeypair();

    let pkAlice = stringToUint8Array(
      ACCOUNT_TEST_PROFILE?.alice?.nostrPrivateKey
    );
    const alicePublicKey = ACCOUNT_TEST_PROFILE?.alice?.nostrPk;
    console.log("pkAlice", new Buffer(pkAlice).toString("hex"));
    console.log("alicePublicKey", alicePublicKey);
    // Bob contract/A.A
    // @TODO Finish SNIP-6 to use it
    //  Use your ENV or Generate public and private key pair when A.A SNIP-06.
    // const AAprivateKey = process.env.AA_PRIVATE_KEY ?? stark.randomAddress();
    // console.log("New account:\nprivateKey=", AAprivateKey);
    // const AAstarkKeyPub =
    //   process.env.AA_PUBKEY ?? ec.starkCurve.getStarkKey(AAprivateKey);
    // console.log("publicKey=", AAstarkKeyPub);
    // await transferToken(
    //   account,
    //   accountAddress0,
    //   TOKENS_ADDRESS?.DEVNET?.ETH,
    //   // token?.address, // TOKENS_ADDRESS.SEPOLIA.TEST,
    //   10
    // );

    /** @description Uncomment to create your social account or comment and change your old contract in the constant ACCOUNT_TEST_PROFILE or direcly below***/
    // console.log("create social account");

    // let accountBob = await createSocialContract(bobPublicKey);
    /** uncomment to use social account deploy when SNIP-6 finish */

    // let accountBob = await createSocialAccount(
    //   bobPublicKey,
    //   AAprivateKey,
    //   AAstarkKeyPub
    // );
    // let accountBob = {
    //   contract_address: undefined,
    // };
    // console.log("accountBob?.contract_address ", accountBob?.contract_address);
    let escrow;

    if (process.env.IS_DEPLOY_CONTRACT == "true") {
      let accountBob = await createEscrowAccount();

      escrow = await prepareAndConnectContract(
        accountBob?.contract_address ?? ACCOUNT_TEST_PROFILE?.escrow?.contract, // uncomment if you recreate a contract
        account
      );
    } else {
      escrow = await prepareAndConnectContract(
        ACCOUNT_TEST_PROFILE?.escrow?.contract,
        account
      );
    }

    /** Send a note */
    let amount: number = 1;
    let strkToken = await prepareAndConnectContract(
      TOKENS_ADDRESS?.SEPOLIA?.BIG_TOKEN,
      account
    );

    /** Deposit */

    let currentId = 1;
    let nextId = 2 //  await escrow.get_next_deposit_id(); // function get need to be made
    console.log("nextId",nextId)


    let depositCurrentId = await escrow.get_deposit(currentId)
    console.log("depositCurrentId",depositCurrentId)

    const depositParams = {
      amount: cairo.uint256(amount), // amount int. Float need to be convert with bnToUint
      // amount: uint256.bnToUint256(BigInt(amount)), // amount
      token_address: strkToken?.address, // token address
      // nostr_recipient: alicePublicKey,
      nostr_recipient: uint256.bnToUint256(BigInt("0x" + alicePublicKey)),
      timelock: 100,
    };

    expect(cairo.uint256(depositCurrentId?.amount)).to.deep.eq(depositParams?.amount)
    // let firstDeposit = 1;


    // console.log("try approve escrow erc20")

    // let txApprove = await strkToken.approve(escrow?.address, depositParams?.amount)

    // await account?.waitForTransaction(txApprove?.transaction_hash)
    // // Need an approve before
    // console.log("deposit amount")

    // let txDeposit = await escrow.deposit(depositParams?.amount, 
    //   depositParams?.token_address,
    //   depositParams?.nostr_recipient,
    //   depositParams?.timelock,
    
    // );
    // console.log("txDeposit",txDeposit)

    // await account?.waitForTransaction(txDeposit?.transaction_hash);

    // currentId++;

    /** Claim */
    let timestamp = new Date().getTime();
    // let content = cairo.felt(currentId);
    let content = cairo.felt(currentId);
    // let content =String(currentId)

    console.log("content event", content);
    console.log("create event for claim")
    const event = finalizeEvent(
      {
        kind: 1,
        tags: [],
        content: content,
        created_at: timestamp,
      },
      pkAlice
    );
    
    console.log(
      "event",
      event
    );
    const signature = event.sig;
    const signatureR = signature.slice(0, signature.length / 2);
    const signatureS = signature.slice(signature.length / 2);
    console.log("signature", signature);
    console.log("signatureR", signatureR);
    console.log("signatureS", signatureS);

    if (signature) {
      let public_key=uint256.bnToUint256(BigInt("0x" + alicePublicKey))
      expect(depositCurrentId?.recipient).to.eq(BigInt("0x" + alicePublicKey))
      const claimParams = {
        public_key: public_key,
        created_at: timestamp,
        kind: 1,
        tags: byteArray.byteArrayFromString("[]"), // tags
        content: content, // currentId in felt
        signature: {
          r: uint256.bnToUint256(BigInt("0x"+signatureR)),
          s: uint256.bnToUint256(BigInt("0x"+signatureS)),
          // r: cairo.uint256(BigInt("0x" + signatureR)),
          // s: cairo.uint256(BigInt("0x" + signatureS)),
        },
      };

      console.log("claimParams", claimParams);
      const tx = await account.execute({
        contractAddress: escrow?.address,
        calldata: claimParams,
        entrypoint: "claim",
      });

      console.log("tx handle claim", tx);
    }
    // console.log("Alice balance STRK", balanceAlice);
    // expect(balanceAlice).to.eq(cairo.uint256(amount));
  });
});

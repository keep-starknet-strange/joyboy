import {
  connectToStarknet,
  createStarknetWallet,
  provider,
} from "../utils/starknet";
import { expect } from "chai";
import { generateKeypair, sendEvent } from "../utils/nostr";
import {
  checkAndFilterSocialPayContent,
  getProfilesByNames,
} from "../utils/check";
import { logDev } from "../utils/log";
import {
  createSocialAccount,
  createSocialContract,
  prepareAndConnectContract,
} from "../utils/social_account";
import { createToken, getToken, transferToken } from "../utils/token";
import {
  Account,
  Call,
  CallData,
  Calldata,
  RawArgsObject,
  byteArray,
  cairo,
  ec,
  getChecksumAddress,
  num,
  shortString,
  stark,
  uint256,
} from "starknet";
import { SocialPayRequest } from "types";
import { ACCOUNT_TEST_PROFILE, TOKENS_ADDRESS } from "../constants";
import {
  hexStringToUint256,
  nostrPubkeyToUint256,
  stringToUint8Array,
  // hexStringToUint256,
  // stringToUint256,
} from "../utils/format";
import dotenv from "dotenv";
import { finalizeEvent, nip19, serializeEvent } from "nostr-tools";
dotenv.config();
/** Testing tips flow:
 * Two users Bob & Alice with Nostr & A.A (contract at this stage) => Init Nostr & SocialPay Account for (contract because SNIP-6 not finish)
 * Bob request a social transfer with an event
 * The basic event note is check, few fetch need to be made to get the data and the right format
 * Send a call with the SocialPayRequest @TODO fix format and serialization
 *
 *
 * @description test1 to use predefined contract with token
 */
describe("End to end test", () => {
  it("Deploy account and Pay tips End to end test", async function () {
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
    let socialPayBob;
    let socialAlice;

    if (process.env.IS_DEPLOY_CONTRACT == 'true') {
      let accountBob = await createSocialContract(bobPublicKey);

      socialPayBob = await prepareAndConnectContract(
        accountBob?.contract_address ?? // uncomment if you recreate a contract
          ACCOUNT_TEST_PROFILE?.bob?.contract ??
          "0x0538907b56f07ef4f90e6f2da26a099ccfbc64e1cc4d03ff1e627fa7c2eb78ac",
        account
      );

      let accountAlice = await createSocialContract(alicePublicKey);
      /** uncomment to use social account deploy when SNIP-6 finish */
      // let accountAlice = await createSocialAccount(
      //   alicePublicKey,
      //   AAprivateKeyAlice,
      //   AAstarkKeyPubAlice
      // );
      // console.log("accountAlice", accountAlice?.contract_address);

      socialAlice = await prepareAndConnectContract(
        accountAlice?.contract_address ??
          ACCOUNT_TEST_PROFILE?.alice?.contract ??
          "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
        account
      );
    } else {
      socialPayBob = await prepareAndConnectContract(
        ACCOUNT_TEST_PROFILE?.bob?.contract ??
          "0x0538907b56f07ef4f90e6f2da26a099ccfbc64e1cc4d03ff1e627fa7c2eb78ac",
        account
      );

      socialAlice = await prepareAndConnectContract(
        ACCOUNT_TEST_PROFILE?.alice?.contract ??
          "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
        account
      );
    }

    let pkBobAccount = await socialPayBob?.get_public_key();
    console.log("public key Bob account", pkBobAccount);
    // let token = await createToken()

    // let TOKEN_TEST=token?.address
    // console.log("TOKEN_TEST",TOKEN_TEST)
    // await transferToken(
    //   account,
    //   socialPayBob?.address,
    //   token?.address, // TOKENS_ADDRESS.SEPOLIA.TEST,
    //   10
    // );

    // const AAprivateKeyAlice = stark.randomAddress();
    // console.log("New account:\nprivateKey=", AAprivateKeyAlice);
    // const AAstarkKeyPubAlice = ec.starkCurve.getStarkKey(AAprivateKeyAlice);
    // console.log("publicKey=", AAstarkKeyPubAlice);
    /** @description Uncomment to create your social account or comment and change your old contract in the constant ACCOUNT_TEST_PROFILE or direcly below***/

    let pkAliceAccount = await socialAlice?.get_public_key();
    console.log("public key Alice Account", pkAliceAccount);

    /** Send a note */
    let amount: number = 1;
    let strkToken = await prepareAndConnectContract(
      TOKENS_ADDRESS?.SEPOLIA?.TEST,
      account
    );

    // let balanceAlice = await strkToken?.balanceOf(
    //   ACCOUNT_TEST_PROFILE?.alice?.contract
    // );

    // console.log("Alice balance STRK", balanceAlice);
    // expect(balanceAlice).to.eq(BigInt(0));

    /** @TODO
     *  utils to fetch token address
     * Format socialRequest and input*/
    // Handle transfer with SocialPay A.A+
    let profileBob = {
      pubkey: bobPublicKey,
      relays: ["wss://relay.joyboy.community.com"],
    };
    let nprofileBob = nip19.nprofileEncode(profileBob);
    console.log("nprofileBob", nprofileBob);
    let nprofileAlice = nip19.nprofileEncode({
      pubkey: alicePublicKey,
      relays: [],
    });
    console.log("nprofileAlice", nprofileAlice);
    // let symbol = await strkToken.symbol();
    let symbol = "BIG_TOKEN";
    console.log("symbol", symbol);
    let timestamp = new Date().getTime();
    let content = `${nprofileBob} send ${amount} ${symbol} to ${nprofileAlice}`;
    console.log("content", content);
    const finalizedFunctionParametersEvent = finalizeEvent(
      {
        kind: 1,
        tags: [],
        content: content,
        created_at: timestamp,
      },
      pkBob
    );
    const signature = finalizedFunctionParametersEvent.sig;
    const signatureR = signature.slice(0, signature.length / 2);
    const signatureS = signature.slice(signature.length / 2);
    if (signature) {
      const functionParametersDummy = {
        public_key: uint256.bnToUint256(BigInt("0x" + bobPublicKey)),
        created_at: timestamp,
        kind: 1,
        tags: byteArray.byteArrayFromString("[]"), // tags
        content: {
          amount: uint256.bnToUint256(BigInt(amount)), // amount
          // amount:cairo.uint256(amount),
          token: byteArray.byteArrayFromString(symbol), // token symbol
          token_address: TOKENS_ADDRESS?.SEPOLIA?.TEST, // token address
          joyboy: {
            public_key: uint256.bnToUint256(BigInt("0x" + bobPublicKey)),
            // [],
            relays: ["wss://relay.joyboy.community.com"],
          },
          recipient: {
            public_key: uint256.bnToUint256(BigInt("0x" + alicePublicKey)),
            realys: [],
          },
        },

        recipient_address:
          ACCOUNT_TEST_PROFILE?.alice?.contract ??
          "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
        signature: {
          r: cairo.uint256(BigInt("0x" + signatureR)),
          s: cairo.uint256(BigInt("0x" + signatureS)),
          // r: uint256.bnToUint256(BigInt("0x" + signatureR)),
          // s: uint256.bnToUint256(BigInt("0x" + signatureS)),
        },
      };

      console.log("before tx handle transfer");
      console.log(
        "finalizedFunctionParametersEvent",
        finalizedFunctionParametersEvent
      );
      console.log(
        "signature",
        signature
      );


      console.log("functionParametersDummy", functionParametersDummy);
      // console.log("account address", account?.address);
      // console.log(" socialPayBob?.address", socialPayBob?.address);
      const tx = await account.execute({
        contractAddress: socialPayBob?.address,
        calldata: functionParametersDummy,
        entrypoint: "handle_transfer",
      });

      console.log("tx handle transfer", tx);
    }

    // console.log("Alice balance STRK", balanceAlice);
    // expect(balanceAlice).to.eq(cairo.uint256(amount));
  });
});

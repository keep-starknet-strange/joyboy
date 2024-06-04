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
dotenv.config();
/** Testing tips flow:
 * Two users Bob & Alice with Nostr & A.A (contract at this stage) => Init Nostr & SocialPay Account for (contract because SNIP-6 not finish)
 * Bob request a social transfer with an event
 * The basic event note is check, few fetch need to be made to get the data and the right format
 * Send a call with the SocialPayRequest @TODO fix format and serialization
 *
 *
 * @description test1 to use predefined contract with token
 * test2 to Deploy contract/account
 */
describe("End to end test", () => {
  it("Script to Pay tips End to end test", async function () {
    this.timeout(0); // Disable timeout for this test

    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;

    const account = new Account(provider, accountAddress0, privateKey0, "1");
    /*** Init account already done
     * @description
     * Get both account for Bob & Alice
     * Send request of account bob to alice
     ***/

    /**  Generate keypair for both account*/

    let pkBob = stringToUint8Array(ACCOUNT_TEST_PROFILE?.bob?.nostrPrivateKey);
    const bobPublicKey = ACCOUNT_TEST_PROFILE?.bob?.nostrPk;
    console.log("pkBob", new Buffer(pkBob).toString("hex"));
    // Bob contract/A.A
    // @TODO Finish SNIP-6 to use it
    //  Use your ENV or Generate public and private key pair when A.A SNIP-06.
    const AAprivateKey = process.env.AA_PRIVATE_KEY ?? stark.randomAddress();
    console.log("New account:\nprivateKey=", AAprivateKey);
    const AAstarkKeyPub =
      process.env.AA_PUBKEY ?? ec.starkCurve.getStarkKey(AAprivateKey);
    console.log("publicKey=", AAstarkKeyPub);
    /** @description Uncomment to create your social account or comment and change your old contract in the constant ACCOUNT_TEST_PROFILE or direcly below***/

    // console.log("accountBob?.contract_address ", accountBob?.contract_address);
    let socialPayBob = await prepareAndConnectContract(
      ACCOUNT_TEST_PROFILE?.bob?.contract ??
        "0x25666639a56e895cc484f8dbd611be2633be561449001aa61bcbd517bc9c7d5",
      account
    );

    let pkBobAccount = await socialPayBob?.get_public_key();
    console.log("public key Bob account", pkBobAccount);

    /** @TODO Alice account key */
    // Nostr account
    let { privateKey: pkAlice, publicKey: alicePublicKey } = generateKeypair();
    let socialAlice = await prepareAndConnectContract(
      // accountAlice?.contract_address ??
      ACCOUNT_TEST_PROFILE?.alice?.contract ??
        "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
      account
    );

    let pkAliceAccount = await socialAlice?.get_public_key();
    console.log("public key Alice Account", pkAliceAccount);

    /** @description
     * Prepare the event
     * Check and format for Social pay
     * Send handle_transfer with Bob account to Alice account
     */

    /** Send a note */
    let amount: number = 10;
    let contentRequest = "@joyboy send 10 STRK to @alice.xyz";
    let content = "a test";
    // Check request, need to be undefined
    let request = checkAndFilterSocialPayContent(content);
    logDev(`first request need to be undefined request ${request}`);
    expect(request).to.eq(undefined);
    // Check request, need to be defined with sender, amount, token, recipient
    request = checkAndFilterSocialPayContent(contentRequest);
    logDev(`second request = ${JSON.stringify(request)}`);
    expect(true).to.eq(true);
    console.log("request", request);
    expect(request).to.deep.eq({
      sender: "@joyboy",
      receiver: "@alice.xyz",
      currency: "STRK",
      amount: 10,
      isValidAddress: false,
    });

    // Send an event predefined sig for the onchain contract request
    let { event, isValid, signature } = await sendEvent(pkBob, contentRequest);
    console.log("event", event);

    /** @TODO prepare request  */

    let eventRequest = await getProfilesByNames(request, event);

    /** @TODO NIP-05 to get user recipient */

    if (eventRequest) {
      eventRequest.receiver = alicePublicKey;
    }
    console.log("Event request handle transfer", eventRequest);

    let strkToken = await prepareAndConnectContract(
      TOKENS_ADDRESS?.SEPOLIA?.STRK,
      account
    );
    let balanceAlice = await strkToken?.balanceOf(
      ACCOUNT_TEST_PROFILE?.alice?.contract
    );

    console.log("Alice balance STRK", balanceAlice);

    expect(balanceAlice).to.eq(BigInt(0));
    /*** Starknet handle_transfer call for SocialPay request
     * @TODO We need to have an hard check for the pubkey before sending tx
     ***/

    /** @TODO
     *  utils to fetch token address
     * Format socialRequest and input*/
    if (event && eventRequest) {
      let socialTransfer: SocialPayRequest = {
        ...eventRequest,
        ...event,
        signature: signature,
        created_at: event?.created_at,
        contentTransfer: {
          amount: cairo.uint256(amount),
          token: byteArray.byteArrayFromString("STRK"),
          token_address: TOKENS_ADDRESS?.SEPOLIA?.STRK,
          joyboy: {
            public_key: nostrPubkeyToUint256(bobPublicKey),
            relays: ["wss://relay.joyboy.community.com"],
          },
          recipient: {
            public_key: nostrPubkeyToUint256(alicePublicKey),
            // relays: ["wss://relay.joyboy.community.com"],
            relays: [],
          },
          recipient_address:
            ACCOUNT_TEST_PROFILE?.alice?.contract ??
            "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
        },
      };
      console.log("socialTransfer", socialTransfer);

      // Handle transfer with SocialPay A.A
      if (socialTransfer?.signature) {
        console.log("send handle_transfer");
        let nostPubkeyUint = nostrPubkeyToUint256(bobPublicKey?.toString());
        /*** @TODO fix issue serialized request and type for attributes **/

        console.log("try function parameters");

        const functionParameters = {
          // public_key:cairo.uint256(1),
          public_key: nostrPubkeyToUint256(bobPublicKey?.toString()),

          /*** @TODO fix created_at deserialize as u64*/
          created_at: parseInt(event?.created_at?.toString()),
          kind: 1,
          tags: byteArray.byteArrayFromString("[]"), // tagsCalls
          content: cairo.tuple({
            ...socialTransfer?.contentTransfer,
          }),
          sig: cairo.tuple({
            r: signature?.r && hexStringToUint256(signature?.r),
            s: signature?.s && hexStringToUint256(signature?.s),
          }),
          /** @TODO fix stringToUint256 for Signature r + s */
          // content: {
          //   ...socialTransfer?.contentTransfer,
          // },
          // sig: {
          //   r: signature?.r && hexStringToUint256(signature?.r),
          //   s: signature?.s && hexStringToUint256(signature?.s),
          // },
        };

        console.log("before tx handle transfer");
        console.log("account address", account?.address);
        console.log(" socialPayBob?.address", socialPayBob?.address);
        const tx = await account.execute({
          contractAddress: socialPayBob?.address,
          calldata: functionParameters,
          entrypoint: "handle_transfer",
        });

        console.log("tx handle transfer", tx);
      }
    }

    console.log("Alice balance STRK", balanceAlice);
    expect(balanceAlice).to.eq(cairo.uint256(amount));
  });

  /*** @description uncomment this test to deploy your own contract, nostr account etc ***/
  // it("Deploy account and Pay tips End to end test", async function () {
  //   this.timeout(0); // Disable timeout for this test

  //   // const resp = await provider.getSpecVersion();
  //   // console.log("rpc version =", resp);
  //   const privateKey0 = process.env.DEV_PK as string;
  //   const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;

  //   const account = new Account(provider, accountAddress0, privateKey0, "1");
  //   /*** Init account
  //    * @description
  //    * Get both account for Bob & Alice
  //    * Send request of account bob to alice
  //    ***/

  //   /**  Generate keypair for both account*/
  //   // Bob nostr account
  //   let { privateKey: pkBob, publicKey: bobPublicKey } = generateKeypair();

  //   // Bob contract/A.A
  //   console.log("create social account");
  //   // @TODO Finish SNIP-6 to use it
  //   //  Use your ENV or Generate public and private key pair when A.A SNIP-06.
  //   const AAprivateKey = process.env.AA_PRIVATE_KEY ?? stark.randomAddress();
  //   console.log("New account:\nprivateKey=", AAprivateKey);
  //   const AAstarkKeyPub =
  //     process.env.AA_PUBKEY ?? ec.starkCurve.getStarkKey(AAprivateKey);
  //   console.log("publicKey=", AAstarkKeyPub);
  //   /** @description Uncomment to create your social account or comment and change your old contract in the constant ACCOUNT_TEST_PROFILE or direcly below***/
  //   let accountBob = await createSocialContract(bobPublicKey);
  //   /** uncomment to use social account deploy when SNIP-6 finish */

  //   // let accountBob = await createSocialAccount(
  //   //   bobPublicKey,
  //   //   AAprivateKey,
  //   //   AAstarkKeyPub
  //   // );
  //   // let accountBob = {
  //   //   contract_address: undefined,
  //   // };
  //   // console.log("accountBob?.contract_address ", accountBob?.contract_address);
  //   let socialPayBob = await prepareAndConnectContract(
  //     accountBob?.contract_address ?? // uncomment if you recreate a contract
  //       ACCOUNT_TEST_PROFILE?.bob?.contract ??
  //       "0x0538907b56f07ef4f90e6f2da26a099ccfbc64e1cc4d03ff1e627fa7c2eb78ac",
  //     account
  //   );

  //   let pkBobAccount = await socialPayBob?.get_public_key();
  //   console.log("public key Bob account", pkBobAccount);

  //   /** @TODO Alice account key */
  //   // Nostr account
  //   let { privateKey: pkAlice, publicKey: alicePublicKey } = generateKeypair();
  //   // const AAprivateKeyAlice = stark.randomAddress();
  //   // console.log("New account:\nprivateKey=", AAprivateKeyAlice);
  //   // const AAstarkKeyPubAlice = ec.starkCurve.getStarkKey(AAprivateKeyAlice);
  //   // console.log("publicKey=", AAstarkKeyPubAlice);
  //   /** @description Uncomment to create your social account or comment and change your old contract in the constant ACCOUNT_TEST_PROFILE or direcly below***/
  //   // let accountAlice = await createSocialContract(
  //   //   alicePublicKey
  //   //   // AAprivateKeyAlice,
  //   //   // AAstarkKeyPubAlice
  //   // );
  //   /** uncomment to use social account deploy when SNIP-6 finish */
  //   // let accountAlice = await createSocialAccount(
  //   //   alicePublicKey,
  //   //   AAprivateKeyAlice,
  //   //   AAstarkKeyPubAlice
  //   // );

  //   let socialAlice = await prepareAndConnectContract(
  //     // accountAlice?.contract_address ??
  //     ACCOUNT_TEST_PROFILE?.alice?.contract ??
  //       "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
  //     account
  //   );

  //   let pkAliceAccount = await socialAlice?.get_public_key();
  //   console.log("public key Alice Account", pkAliceAccount);

  //   /** @description
  //    * Prepare the event
  //    * Check and format for Social pay
  //    * Send handle_transfer with Bob account to Alice account
  //    */

  //   /** Send a note */
  //   let amount: number = 10;
  //   let contentRequest = "@joyboy send 10 STRK to @alice.xyz";
  //   let content = "a test";
  //   // Check request, need to be undefined
  //   let request = checkAndFilterSocialPayContent(content);
  //   logDev(`first request need to be undefined request ${request}`);
  //   expect(request).to.eq(undefined);
  //   // Check request, need to be defined with sender, amount, token, recipient
  //   request = checkAndFilterSocialPayContent(contentRequest);
  //   logDev(`second request = ${JSON.stringify(request)}`);
  //   expect(true).to.eq(true);
  //   console.log("request", request);
  //   expect(request).to.deep.eq({
  //     sender: "@joyboy",
  //     receiver: "@alice.xyz",
  //     currency: "STRK",
  //     amount: 10,
  //     isValidAddress: false,
  //   });

  //   // Send an event predefined sig for the onchain contract request
  //   let { event, isValid, signature } = await sendEvent(pkBob, contentRequest);
  //   console.log("event", event);

  //   /** @TODO prepare request  */

  //   let eventRequest = await getProfilesByNames(request, event);

  //   /** @TODO NIP-05 to get user recipient */

  //   if (eventRequest) {
  //     eventRequest.receiver = alicePublicKey;
  //   }
  //   console.log("Event request handle transfer", eventRequest);

  //   let strkToken = await prepareAndConnectContract(
  //     TOKENS_ADDRESS?.SEPOLIA?.STRK,
  //     account
  //   );
  //   let balanceAlice = await strkToken?.balanceOf(
  //     ACCOUNT_TEST_PROFILE?.alice?.contract
  //   );

  //   console.log("Alice balance STRK", balanceAlice);

  //   expect(balanceAlice).to.eq(BigInt(0));
  //   /*** Starknet handle_transfer call for SocialPay request
  //    * @TODO We need to have an hard check for the pubkey before sending tx
  //    ***/

  //   /** @TODO
  //    *  utils to fetch token address
  //    * Format socialRequest and input*/
  //   if (event && eventRequest) {
  //     let socialTransfer: SocialPayRequest = {
  //       ...eventRequest,
  //       ...event,
  //       signature: signature,
  //       created_at: event?.created_at,
  //       /** @TODO fix format and type */
  //       contentTransfer: {
  //         amount: cairo.uint256(amount),
  //         token: byteArray.byteArrayFromString("STRK"),
  //         token_address: TOKENS_ADDRESS?.SEPOLIA?.STRK,
  //         joyboy: {
  //           public_key: nostrPubkeyToUint256(bobPublicKey),
  //           relays: ["wss://relay.joyboy.community.com"],
  //         },
  //         recipient: {
  //           public_key: nostrPubkeyToUint256(alicePublicKey),
  //           relays: ["wss://relay.joyboy.community.com"],
  //         },
  //         recipient_address:
  //           ACCOUNT_TEST_PROFILE?.alice?.contract ??
  //           "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
  //       },
  //     };
  //     console.log("socialTransfer", socialTransfer);

  //     // Handle transfer with SocialPay A.A
  //     if (socialTransfer?.signature) {
  //       const tagsLongString: string[] = shortString
  //         .splitLongString("[]")
  //         .map((str) => shortString.encodeShortString(str));
  //       const tagsCalls = CallData.compile([
  //         byteArray.byteArrayFromString("[]"),
  //       ]);
  //       console.log("send handle_transfer");
  //       let nostPubkeyUint = nostrPubkeyToUint256(bobPublicKey?.toString());
  //       /*** @TODO fix issue serialized request and type for attributes **/

  //       console.log("try function parameters");
  //       const functionParameters: RawArgsObject = {
  //         //wrong order; all properties are mixed
  //         public_key:
  //           nostPubkeyUint ?? nostrPubkeyToUint256(bobPublicKey?.toString()),
  //         kind: 1,
  // //        tags: tagsCalls,
  // tags:byteArray.byteArrayFromString("[]"), // tagsCalls

  //         /** @TODO fix stringToUint256 for Signature r + s */
  //         content: {
  //           ...socialTransfer?.contentTransfer,
  //         },
  //         sig: {
  //           r: signature?.r && hexStringToUint256(signature?.r),
  //           s: signature?.s && hexStringToUint256(signature?.s),
  //           // r:signature?.r && cairo.uint256(signature?.r),
  //           // s:signature?.s && cairo.uint256(signature?.s),
  //         },
  //       };
  //       console.log("before tx handle transfer");
  //       // const tx = await account.execute(myCall);
  //       console.log("account address", account?.address);
  //       console.log(" socialPayBob?.address", socialPayBob?.address);
  //       const tx = await account.execute({
  //         contractAddress: socialPayBob?.address,
  //         calldata: functionParameters,
  //         entrypoint: "handle_transfer",
  //       });

  //       console.log("tx handle transfer", tx);
  //     }
  //   }

  //   console.log("Alice balance STRK", balanceAlice);
  //   expect(balanceAlice).to.eq(cairo.uint256(amount));
  // });
});

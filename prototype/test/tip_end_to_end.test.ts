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
 * test2 to Deploy contract/account
 */
describe("End to end test", () => {
  /*** @description uncomment this test to deploy your own contract, nostr account etc ***/
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
    let socialPayBob = await prepareAndConnectContract(
      // accountBob?.contract_address ?? // uncomment if you recreate a contract
      ACCOUNT_TEST_PROFILE?.bob?.contract ??
        "0x0538907b56f07ef4f90e6f2da26a099ccfbc64e1cc4d03ff1e627fa7c2eb78ac",
      account
    );

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

    /** @TODO Alice account key */
    // Nostr account
    // let { privateKey: pkAlice, publicKey: alicePublicKey } = generateKeypair();
    
    let pkAlice = stringToUint8Array(ACCOUNT_TEST_PROFILE?.alice?.nostrPrivateKey);
    const alicePublicKey = ACCOUNT_TEST_PROFILE?.alice?.nostrPk;
    // const AAprivateKeyAlice = stark.randomAddress();
    // console.log("New account:\nprivateKey=", AAprivateKeyAlice);
    // const AAstarkKeyPubAlice = ec.starkCurve.getStarkKey(AAprivateKeyAlice);
    // console.log("publicKey=", AAstarkKeyPubAlice);
    /** @description Uncomment to create your social account or comment and change your old contract in the constant ACCOUNT_TEST_PROFILE or direcly below***/
    // let accountAlice = await createSocialContract(
    //   alicePublicKey
    //   // AAprivateKeyAlice,
    //   // AAstarkKeyPubAlice
    // );
    /** uncomment to use social account deploy when SNIP-6 finish */
    // let accountAlice = await createSocialAccount(
    //   alicePublicKey,
    //   AAprivateKeyAlice,
    //   AAstarkKeyPubAlice
    // );
    // console.log("accountAlice", accountAlice?.contract_address);

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
    let amount: number = 1;
    // let contentRequest = "@joyboy send 10 STRK to @alice.xyz";
    let contentRequest = `@joyboy send ${amount} STRK to @alice.xyz`;

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
      amount: amount,
      isValidAddress: false,
    });

    // Send an event predefined sig for the onchain contract request
    let {
      event,
      isValid,
      // signature
    } = await sendEvent(pkBob, contentRequest);
    console.log("event", event);

    // let serialize= serializeEvent(event)

    /** @TODO prepare request  */

    let eventRequest = await getProfilesByNames(request, event);

    /** @TODO NIP-05 to get user recipient */

    if (eventRequest) {
      eventRequest.receiver = alicePublicKey;
    }
    console.log("Event request handle transfer", eventRequest);

    let strkToken = await prepareAndConnectContract(
      TOKENS_ADDRESS?.SEPOLIA?.TEST,
      account
    );
    let balanceAlice = await strkToken?.balanceOf(
      ACCOUNT_TEST_PROFILE?.alice?.contract
    );

    console.log("Alice balance STRK", balanceAlice);

    // expect(balanceAlice).to.eq(BigInt(0));
    /*** Starknet handle_transfer call for SocialPay request
     * @TODO We need to have an hard check for the pubkey before sending tx
     ***/

    /** @TODO
     *  utils to fetch token address
     * Format socialRequest and input*/
    if (event && eventRequest) {
      // Handle transfer with SocialPay A.A+
      let profileBob = {
        pubkey: bobPublicKey,
        // relays: ["wss://relay.joyboy.community.com"],
        relays: [],

      };
      let nprofileBob = nip19.nprofileEncode(profileBob);
      console.log("nprofileBob",nprofileBob)
      let nprofileAlice = nip19.nprofileEncode({
        pubkey: alicePublicKey,
        relays: [],
      });
      console.log("nprofileAlice",nprofileAlice)

      // const finalizedFunctionParametersEvent = finalizeEvent(
      //   {
      //     kind: 1,
      //     tags: [],
      //     content: `${nprofileBob} send ${amount} TEST to ${nprofileAlice}`,
      //     // content: JSON.stringify({
      //     //   amount: amount,
      //     //   token: "TEST",
      //     //   token_address: TOKENS_ADDRESS?.SEPOLIA?.TEST,
      //     //   joyboy: {
      //     //     public_key: bobPublicKey,
      //     //     relays: [],
      //     //   },
      //     //   recipient: {
      //     //     public_key: alicePublicKey,
      //     //     relays: [],
      //     //   },
      //     //   recipient_address:
      //     //     ACCOUNT_TEST_PROFILE?.alice?.contract ??
      //     //     "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
      //     // }),
      //     // created_at: event?.created_at,
      //     created_at: new Date().getTime(),

      //   },
      //   pkBob
      // );
      const finalizedFunctionParametersEvent = finalizeEvent(
        {
          kind: 1,
          tags: [],
          content: `${nprofileBob} send ${amount} TEST to ${nprofileAlice}`,
          created_at: new Date().getTime(),
        },
        pkBob
      );
      const signature = finalizedFunctionParametersEvent.sig;
      const signatureR = signature.slice(0, signature.length / 2);
      const signatureS = signature.slice(signature.length / 2);
      if (signature) {
        // const functionParameters = [
        //   // nostrPubkeyToUint256(bobPublicKey?.toString()),
        //   cairo.uint256(pkBobAccount),
        //   // uint256.bnToUint256(BigInt("0x" + bobPublicKey)),

        //   // pkBobAccount,
        //   // event?.created_at?.toString(),
        //   event?.created_at,
        //   1,
        //   byteArray.byteArrayFromString("[]"),
        //   socialTransfer?.contentTransfer,
        //   {
        //     r: uint256.bnToUint256(BigInt("0x" + signR)),
        //     s: uint256.bnToUint256(BigInt("0x" + signS)),
        //     // s: hexStringToUint256(signS),
        //     // r: cairo.uint256(signR),
        //     // s: cairo.uint256(signS),
        //     // r: signR,
        //     // s: signS,
        //     // r: cairo.uint256(
        //     //   "0x3570a9a0c92c180bd4ac826c887e63844b043e3b65da71a857d2aa29e7cd3a4e"
        //     // ),
        //     // s: cairo.uint256(
        //     //   "0x3570a9a0c92c180bd4ac826c887e63844b043e3b65da71a857d2aa29e7cd3a4e"
        //     // ),
        //     // r: signature?.r && hexStringToUint256(signature?.r),
        //     // s: signature?.s && hexStringToUint256(signature?.s),
        //     // r: hexStringToUint256(signR),
        //     // s: hexStringToUint256(signS),
        //   },
        // ];

        // const functionParameters = [
        //   cairo.uint256(pkBobAccount), // uint256.bnToUint256(BigInt("0x" + bobPublicKey)),
        //   finalizedFunctionParametersEvent?.created_at,
        //   1,
        //   byteArray.byteArrayFromString("[]"), // tags
        //   uint256.bnToUint256(BigInt(amount)), // amount
        //   byteArray.byteArrayFromString("TEST"), // token symbol
        //   getChecksumAddress(TOKENS_ADDRESS?.SEPOLIA?.TEST), // token address
        //   uint256.bnToUint256(BigInt("0x" + bobPublicKey)),
        //   // "0x" + bobPublicKey,
        //   [],
        //   cairo.uint256(pkAliceAccount), // uint256.bnToUint256(BigInt("0x" + alicePublicKey)),
        //   [],
        //   getChecksumAddress(
        //     ACCOUNT_TEST_PROFILE?.alice?.contract ??
        //       "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1"
        //   ),
        //   uint256.bnToUint256(BigInt("0x" + signatureR)),
        //   uint256.bnToUint256(BigInt("0x" + signatureS)),
        // ];
        // console.log("functionParameters", functionParameters);

        // const functionParametersDummy = [
        //   cairo.uint256(pkBobAccount), // uint256.bnToUint256(BigInt("0x" + bobPublicKey)),
        //   finalizedFunctionParametersEvent?.created_at,
        //   1,
        //   byteArray.byteArrayFromString("[]"), // tags
        //   uint256.bnToUint256(BigInt(amount)), // amount
        //   byteArray.byteArrayFromString("TEST"), // token symbol
        //   getChecksumAddress(TOKENS_ADDRESS?.SEPOLIA?.TEST), // token address
        //   uint256.bnToUint256(BigInt("0x" + bobPublicKey)),
        //   // "0x" + bobPublicKey,
        //   ["wss://relay.joyboy.community.com"],
        //   cairo.uint256(pkAliceAccount), // uint256.bnToUint256(BigInt("0x" + alicePublicKey)),
        //   [],
        //   getChecksumAddress(
        //     ACCOUNT_TEST_PROFILE?.alice?.contract ??
        //       "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1"
        //   ),
        //   uint256.bnToUint256(BigInt("0x" + signatureR)),
        //   uint256.bnToUint256(BigInt("0x" + signatureS)),
        // ];

        const functionParametersDummy = [
          // uint256.bnToUint256(bobPublicKey), // uint256.bnToUint256(BigInt("0x" + bobPublicKey)),
          uint256.bnToUint256(BigInt("0x" + bobPublicKey)),
        
          // cairo.uint256(bobPublicKey), // uint256.bnToUint256(BigInt("0x" + bobPublicKey)),

          // uint256.bnToUint256("97222190664923577697232436244924436943183762259335404131785622463208003961201"), // uint256.bnToUint256(BigInt("0x" + bobPublicKey)),
          "1716285235",
          1,
          byteArray.byteArrayFromString("[]"), // tags
          uint256.bnToUint256(BigInt(amount)), // amount
          byteArray.byteArrayFromString("TEST"), // token symbol
          getChecksumAddress(TOKENS_ADDRESS?.SEPOLIA?.TEST), // token address
          uint256.bnToUint256(BigInt("0x" + bobPublicKey)),
          // "0x" + bobPublicKey,
          // ["wss://relay.joyboy.community.com"],
          [],
          uint256.bnToUint256(BigInt("0x" + alicePublicKey)),
          // cairo.uint256(pkAliceAccount), // uint256.bnToUint256(BigInt("0x" + alicePublicKey)),
          [],
          getChecksumAddress(
            ACCOUNT_TEST_PROFILE?.alice?.contract ??
              "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1"
          ),
          // {
          //   // r: "0x3570a9a0c92c180bd4ac826c887e63844b043e3b65da71a857d2aa29e7cd3a4e",
          //   // s: "0x1c0c0a8b7a8330b6b8915985c9cd498a407587213c2e7608e7479b4ef966605f",
          //   r:cairo.uint256("24171638576078281794368410527468905496497988497448814608660484064887975000654"),
            
          //   s:cairo.uint256("12686034702906922263785357016076956293086009546396231082163943033601530421343")
          //   // r:"24171638576078281794368410527468905496497988497448814608660484064887975000654",
          //   // s:"12686034702906922263785357016076956293086009546396231082163943033601530421343"
          //   // r: uint256.bnToUint256("0x3570a9a0c92c180bd4ac826c887e63844b043e3b65da71a857d2aa29e7cd3a4e"),

          //   // s: uint256.bnToUint256("0x1c0c0a8b7a8330b6b8915985c9cd498a407587213c2e7608e7479b4ef966605f"),

            
          //   // r: uint256.bnToUint256("24171638576078281794368410527468905496497988497448814608660484064887975000654"),

          //   // s: uint256.bnToUint256("12686034702906922263785357016076956293086009546396231082163943033601530421343"),
          //   // r: cairo.uint256("0x3570a9a0c92c180bd4ac826c887e63844b043e3b65da71a857d2aa29e7cd3a4e"),
          //   // s: cairo.uint256("0x1c0c0a8b7a8330b6b8915985c9cd498a407587213c2e7608e7479b4ef966605f"),

          //   // r: cairo.uint256("24171638576078281794368410527468905496497988497448814608660484064887975000654"),
          //   // s: cairo.uint256("12686034702906922263785357016076956293086009546396231082163943033601530421343"),
          // },
        //  "0x3570a9a0c92c180bd4ac826c887e63844b043e3b65da71a857d2aa29e7cd3a4e",
          // "0x1c0c0a8b7a8330b6b8915985c9cd498a407587213c2e7608e7479b4ef966605f",
          uint256.bnToUint256(BigInt("0x" + signatureR)),
          uint256.bnToUint256(BigInt("0x" + signatureS)),
        ];

        console.log("before tx handle transfer");
        console.log(
          "finalizedFunctionParametersEvent",
          finalizedFunctionParametersEvent
        );

        console.log("functionParametersDummy", functionParametersDummy);
        // const tx = await account.execute(myCall);
        // console.log("account address", account?.address);
        // console.log(" socialPayBob?.address", socialPayBob?.address);
        const tx = await account.execute({
          contractAddress: socialPayBob?.address,
          calldata: functionParametersDummy,
          entrypoint: "handle_transfer",
        });

        console.log("tx handle transfer", tx);

        // console.log("send handle_transfer");
        // const sig = event?.sig;
        // console.log("sig", sig);
        // const len = sig?.length;
        // const signR = sig?.slice(0, len / 2);
        // console.log("signR", signR);

        // const signS = sig?.slice(len / 2, len);
        // console.log("signS", signS);

        // let socialTransfer: SocialPayRequest = {
        //   ...eventRequest,
        //   ...event,
        //   // signature: signature,
        //   created_at: event?.created_at,
        //   /** @TODO fix format and type */
        //   contentTransfer: {
        //     // amount: cairo.uint256(amount),
        //     amount: cairo.uint256(amount),
        //     // amount: num.toHex(amount),
        //     token: byteArray.byteArrayFromString("TEST"),
        //     token_address: TOKENS_ADDRESS?.SEPOLIA?.TEST, // TOKENS_ADDRESS?.SEPOLIA?.TEST,
        //     joyboy: {
        //       public_key: nostrPubkeyToUint256(bobPublicKey),
        //       // relays: [byteArray.byteArrayFromString(
        //       //   "wss://relay.joyboy.community.com"
        //       // )],
        //       relays: [],
        //       // relays: byteArray.byteArrayFromString(
        //       //   "wss://relay.joyboy.community.com"
        //       // ),
        //     },
        //     recipient: {
        //       // public_key: nostrPubkeyToUint256(alicePublicKey),
        //       public_key: cairo.uint256(pkAliceAccount),
        //       // relays: ["wss://relay.joyboy.community.com"],
        //       relays: [],
        //       // relays: [byteArray.byteArrayFromString(
        //       //   "wss://relay.joyboy.community.com"
        //       // )]
        //     },
        //     recipient_address:
        //       ACCOUNT_TEST_PROFILE?.alice?.contract ??
        //       "0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
        //   },
        // };
        // console.log("socialTransfer alicePublicKey", alicePublicKey);
        // console.log(
        //   "socialTransfer joyboy",
        //   socialTransfer?.contentTransfer?.joyboy
        // );
        // console.log(
        //   "socialTransfer recipient",
        //   socialTransfer?.contentTransfer?.recipient
        // );
      }
    }

    console.log("Alice balance STRK", balanceAlice);
    expect(balanceAlice).to.eq(cairo.uint256(amount));
  });
});

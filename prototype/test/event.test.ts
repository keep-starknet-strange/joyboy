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
import { serializeEvent } from "nostr-tools";
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
describe("Event", () => {
 

  /*** @description uncomment this test to deploy your own contract, nostr account etc ***/
  it("Check event", async function () {
    this.timeout(0); // Disable timeout for this test

    // const resp = await provider.getSpecVersion();
    // console.log("rpc version =", resp);
    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;

    const account = new Account(provider, accountAddress0, privateKey0, "1");
    
    let pkBob = stringToUint8Array(ACCOUNT_TEST_PROFILE?.bob?.nostrPrivateKey);
    const bobPublicKey = ACCOUNT_TEST_PROFILE?.bob?.nostrPk;
    console.log("pkBob", new Buffer(pkBob).toString("hex"));
    console.log("bobPublicKey", bobPublicKey);

    // Bob contract/A.A
   
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

  });
});

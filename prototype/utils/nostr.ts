import {
  Event,
  SimplePool,
  generateSecretKey,
  getEventHash,
  getPublicKey,
  nip05,
} from "nostr-tools";
import { finalizeEvent, verifyEvent } from "nostr-tools";
import { Relay } from "nostr-tools";
import { logDev } from "./log";
import * as secp from "@noble/secp256k1";

export const generateKeypair = () => {
  let privateKey = generateSecretKey(); // `sk` is a Uint8Array
  let publicKey = getPublicKey(privateKey); // `pk` is a hex string

  return {
    privateKey,
    publicKey,
  };
};
// Transform the event signature string to a Signature object
function transformSignature(signature: string) {
  const buffer = Buffer.from(signature, "hex");
  // Assuming Signature object needs to be constructed in a specific way
  return {
    r: buffer.slice(0, 32).toString("hex"),
    s: buffer.slice(32).toString("hex"),
  };
}
/** Verify send event
 */
export const sendEvent = async (
  sk: Uint8Array,
  content: string = "@joyboy send 20 USDC to @alice.xyz"
) => {
  let eventRender: Event | undefined;
  try {
    let event = finalizeEvent(
      {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: content,
      },
      sk
    );
    let isGood = verifyEvent(event);
    eventRender = event;

    logDev(`event is good ${isGood}`);
    if (!isGood) {
      return { event: undefined, isValid: false };
    }

    const eventId = getEventHash(event as any);
    const messageHash = Buffer.from(eventId, "hex");

    const signature = await secp.sign(messageHash, sk);
    let sig = transformSignature(Buffer.from(signature).toString("hex"));


    /** To test the local Nostr relayer */
    // const pool = new SimplePool();
    // await pool.publish(
    //   [process.env.NOSTR_RELAYER_WEBSOCKET ?? "ws://localhost:3000"],
    //   event
    // );
    return {
      nostrEvent: event,
      event: {
        ...event,
        signature: {
          r: sig?.r,
          s: sig?.s,
        },
      },
      signature:sig,
      isValid: true,
    };
  } catch (e) {
    console.log("Error send note", e);
    return {
      event: eventRender,
      isValid: false,
    };
  }
};

/** @TODO implement get public key by handle with NIP-05 and NIP-24 */
export const getPublicKeyByHandle = async (name: string) => {
  try {
    let profile;
    profile = await nip05.queryProfile(name);
    /** try get event NIP-24 */
    if (!profile) {
    }
    return profile;
  } catch (e) {
    console.log("Error getPublicKeyByHandle", e);
  }
};

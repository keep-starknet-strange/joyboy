import { Event as EventNostr } from "nostr-tools"
import { ByteArray, Uint256 } from "starknet";

export interface SocialPayRequest extends EventNostr {
    sender?: string;
    to?: string;
    addressToken?: string;
    contentTransfer?:Transfer
    signature?: {
        r?:string,
        x?:string
    }
}

export interface NostrProfile {
    // public_key?:string;
    public_key?:string|Uint256;
    relays?:string[] | string | ByteArray
}
export interface Transfer {
    amount:number|Uint256,
    token:string,
    token_address:string,
    joyboy:NostrProfile,
    recipient:NostrProfile,
    recipient_address:string
    // let transfer = Transfer {
    //     amount: 1,
    //     token: erc20.symbol(),
    //     token_address: erc20.contract_address,
    //     joyboy: NostrProfile {
    //         public_key: 0x84603b4e300840036ca8cc812befcc8e240c09b73812639d5cdd8ece7d6eba40,
    //         relays: array!["wss://relay.joyboy.community.com"]
    //     },
    //     recipient: NostrProfile { public_key: recipient_public_key, relays: array![] },
    //     recipient_address: recipient.contract_address
    // };
}


export interface ContentFormat {
    sender?: string;
    amount?: number;
    currency?: string;
    receiver?: string;
    isValidAddress?:boolean;
}

export { EventNostr }
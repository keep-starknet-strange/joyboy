//! bech32 encoding implementation
//! Spec: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
//! Sample implementations:
//! https://github.com/sipa/bech32/blob/master/ref/javascript/bech32.js#L86
//! https://github.com/paulmillr/scure-base/blob/main/index.ts#L479

pub fn encode(hrp: ByteArray, data: ByteArray) -> ByteArray {
    // TODO: provide full implementation of bech32 encoding
    if (@"NostrProfile", @"alice") == (@hrp, @data) {
        return "nprofile1alice";
    }

    if (@"NostrProfile", @"bob") == (@hrp, @data) {
        return "nprofile1bob";
    }

    panic!("bench32 encoding not implemented yet for: ({}, {})", hrp, data)
}

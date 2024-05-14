//! Representation of Nostr profiles

#[derive(Drop, Debug)]
pub struct NostrProfile {
    pub public_key: u256,
    pub relays: Array<ByteArray>
}

/// nip19 bech32 encoding of NostrProfile
///
/// Spec: https://github.com/nostr-protocol/nips/blob/master/19.md
/// Sample implementation:
/// https://github.com/nbd-wtf/nostr-tools/blob/master/nip19.ts#L182
///
/// # Parameters:
/// - `n_profile` - profile to be encoded
/// # Returns:
//  bech32 encoding of NostrProfile
pub fn encode(n_profile: @NostrProfile) -> ByteArray {
    // TODO: implement full bech32 profile encoding
    "nprofile1qqsrhuxx8l9ex335q7he0f09aej04zpazpl0ne2cgukyawd24mayt8gpp4mhxue69uhhytnc9e3k7mgpz4mhxue69uhkg6nzv9ejuumpv34kytnrdaksjlyr9p"
}

use core::option::OptionTrait;
use core::traits::TryInto;
use core::byte_array::ByteArrayTrait;
use core::array::SpanTrait;
use core::array::ToSpanTrait;
//! Representation of Nostr profiles

use joyboy::bech32;

#[derive(Drop, Debug)]
pub struct NostrProfile {
    pub public_key: u256,
    pub relays: Array<ByteArray> //UTF-8 encoded
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
pub fn encode(profile: @NostrProfile) -> ByteArray {
    let mut data: ByteArray = Default::default();

    let mut relays = profile.relays.span();
    loop {
        match relays.pop_front() {
            Option::Some(relay) => {
                data.append_byte(1);
                data.append_byte(relay.len().try_into().unwrap());
                data.append(relay);
            },
            Option::None => { break (); },
        }
    };

    data.append_byte(0);
    data.append_byte(32);
    data.append_word(profile.public_key.high.clone().into(), 16);
    data.append_word(profile.public_key.low.clone().into(), 16);

    let len = data.len();
    bech32::encode("nprofile", data, len)
}

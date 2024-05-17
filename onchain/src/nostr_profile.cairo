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
    bech32::encode(@"nprofile", @data, len)
}

#[cfg(test)]
mod tests {
    use joyboy::nostr_profile::{NostrProfile, encode};

    // test data generated with: https://replit.com/@maciejka/WanIndolentKilobyte

    #[test]
    fn test_encode_01() {
        let profile = NostrProfile {
            public_key: 0x84603b4e300840036ca8cc812befcc8e240c09b73812639d5cdd8ece7d6eba40,
            relays: array![
                "wss://relay.nostr.example.mydomain.example.com", "wss://nostr.banana.com"
            ]
        };

        let expected =
            "nprofile1qyh8wumn8ghj7un9d3shjtnwdaehgu3wv4uxzmtsd3jjumtev3hk6ctfdchx27rpd4cxcefwvdhk6qgkwaehxw309ahx7um5wghxyctwv9hxztnrdaksqgyyvqa5uvqggqpke2xvsy47lnywysxqndeczf3e6hxa3m886m46gqlwp5er";

        assert_eq!(encode(@profile), expected);
    }

    #[test]
    fn test_encode_02() {
        let profile = NostrProfile {
            public_key: 0xa87622b57b52f366457e867e1dccc60ea631ccac94b7c74ab08254c489ef12c6,
            relays: array![]
        };

        let expected = "nprofile1qqs2sa3zk4a49umxg4lgvlsaenrqaf33ejkffd78f2cgy4xy38h393s2w22mm";

        assert_eq!(encode(@profile), expected);
    }

    #[test]
    fn test_encode_03() {
        let profile = NostrProfile {
            public_key: 0x9e70a69f8f27c89d940dcdde0459798cd69ef291830e2ffa44ebfdad47df094c,
            relays: array!["wss://nostr.banana.com"]
        };

        let expected =
            "nprofile1qyt8wumn8ghj7mn0wd68ytnzv9hxzmnp9e3k7mgqyz08pf5l3unu38v5phxaupze0xxdd8hjjxpsutl6gn4lmt28muy5cevgzmu";

        assert_eq!(encode(@profile), expected);
    }
}


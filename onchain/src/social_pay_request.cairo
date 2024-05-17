use starknet::ContractAddress;
use core::to_byte_array::{FormatAsByteArray, AppendFormattedToByteArray};
use core::fmt::{Display, Formatter, Error};

use joyboy::nostr_profile::{NostrProfile, encode};

type NostrKey = u256;

#[derive(Drop)]
struct SocialPayRequest {
    amount: u256,
    token: felt252,
    joyboy: NostrProfile,
    recipient: NostrProfile
}

impl DisplaySocialPayRequest of Display<SocialPayRequest> {
    fn fmt(self: @SocialPayRequest, ref f: Formatter) -> Result<(), Error> {
        f
            .buffer
            .append(
                @format!(
                    "{} send {} {} to {}",
                    encode(self.joyboy),
                    self.amount,
                    self.token,
                    encode(self.recipient)
                )
            );
        Result::Ok(())
    }
}


#[cfg(test)]
mod tests {
    use core::option::OptionTrait;
    use super::{SocialPayRequest};
    use joyboy::nostr_profile::NostrProfile;

    #[test]
    fn test_fmt() {
        let joyboy = NostrProfile {
            public_key: 0x84603b4e300840036ca8cc812befcc8e240c09b73812639d5cdd8ece7d6eba40,
            relays: array!["wss://relay.joyboy.community.com"]
        };

        let recipient = NostrProfile {
            public_key: 0xa87622b57b52f366457e867e1dccc60ea631ccac94b7c74ab08254c489ef12c6,
            relays: array![]
        };

        let request = SocialPayRequest { amount: 1, token: 'USDC', joyboy, recipient };

        let expected = "nprofile1qys8wumn8ghj7un9d3shjtn2daukymme9e3k7mtdw4hxjare9e3k7mgqyzzxqw6wxqyyqqmv4rxgz2l0ej8zgrqfkuupycuatnwcannad6ayqx7zdcy send 1 1431520323 to nprofile1qqs2sa3zk4a49umxg4lgvlsaenrqaf33ejkffd78f2cgy4xy38h393s2w22mm";

        assert_eq!(format!("{request}"), expected);

    }
}

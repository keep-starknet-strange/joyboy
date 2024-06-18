use starknet::ContractAddress;
use super::profile::{NostrProfile, NostrProfileTrait};
use super::request::Encode;

#[derive(Clone, Debug, Drop, Serde)]
pub struct Transfer {
    pub amount: u256,
    pub token: felt252,
    pub token_address: ContractAddress,
    pub joyboy: NostrProfile,
    pub recipient: NostrProfile,
    pub recipient_address: ContractAddress
}

fn len(f: felt252) -> usize {
    let mut f: u128 = f.try_into().unwrap();
    let mut l = 0;
    while f != 0 {
        f = f / 256;
        l += 1;
    };
    l
}

impl TransferEncodeImpl of Encode<Transfer> {
    fn encode(self: @Transfer) -> @ByteArray {
        let mut token: ByteArray = Default::default();
        // assuming token is no longer than 16 bytes
        token.append_word(*self.token, len(*self.token));
        @format!(
            "{} send {} {} to {}", self.joyboy.encode(), self.amount, token, self.recipient.encode()
        )
    }
}

#[cfg(test)]
mod tests {
    use core::option::OptionTrait;
    use starknet::ContractAddress;
    use super::Transfer;
    use super::super::profile::{NostrProfile};
    use super::super::request::Encode;

    #[test]
    fn encode() {
        let joyboy = NostrProfile {
            public_key: 0x84603b4e300840036ca8cc812befcc8e240c09b73812639d5cdd8ece7d6eba40,
            relays: array!["wss://relay.joyboy.community.com"]
        };

        let recipient = NostrProfile {
            public_key: 0xa87622b57b52f366457e867e1dccc60ea631ccac94b7c74ab08254c489ef12c6,
            relays: array![]
        };

        let request = Transfer {
            amount: 1,
            token: 'USDC',
            token_address: 1.try_into().unwrap(),
            joyboy,
            recipient,
            recipient_address: 1.try_into().unwrap(),
        };

        let expected =
            "nprofile1qys8wumn8ghj7un9d3shjtn2daukymme9e3k7mtdw4hxjare9e3k7mgqyzzxqw6wxqyyqqmv4rxgz2l0ej8zgrqfkuupycuatnwcannad6ayqx7zdcy send 1 USDC to nprofile1qqs2sa3zk4a49umxg4lgvlsaenrqaf33ejkffd78f2cgy4xy38h393s2w22mm";

        assert_eq!(request.encode(), @expected);
    }
}

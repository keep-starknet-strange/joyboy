use starknet::ContractAddress;
use core::to_byte_array::{FormatAsByteArray, AppendFormattedToByteArray};
use core::fmt::{Display, Formatter, Error};

use joyboy::nostr_profile::{NostrProfile, encode};
use joyboy::bip340::{verify};
use joyboy::nip01::{NIP01Event};

type NostrKey = u256;

#[derive(Copy, Drop, Debug)]
enum Token {
    DAI,
    ETH,
    STRK,
    USDC,
}

#[derive(Drop)]
struct SocialPayRequest {
    amount: u256,
    token: Token,
    joyboy: NostrProfile,
    recipient: NostrProfile
}

impl DisplayToken of Display<Token> {
    fn fmt(self: @Token, ref f: Formatter) -> Result<(), Error> {
        f
            .buffer
            .append(
                @match *self {
                    Token::DAI => "DAI",
                    Token::ETH => "ETH",
                    Token::STRK => "STRK",
                    Token::USDC => "USDC",
                }
            );
        Result::Ok(())
    }
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
    use super::{SocialPayRequest, Token};
    use joyboy::nostr_profile::NostrProfile;

    #[test]
    fn test_to_byte_array() {
        let joyboy = NostrProfile { public_key: 123_u256, relays: array![] };
        let recipient = NostrProfile { public_key: 345_u256, relays: array![] };
        let r = SocialPayRequest { amount: 1, token: Token::USDC, joyboy, recipient };
        assert_eq!(
            format!("{r}"),
            "nprofile1qqsrhuxx8l9ex335q7he0f09aej04zpazpl0ne2cgukyawd24mayt8gpp4mhxue69uhhytnc9e3k7mgpz4mhxue69uhkg6nzv9ejuumpv34kytnrdaksjlyr9p send 1 USDC to nprofile1qqsrhuxx8l9ex335q7he0f09aej04zpazpl0ne2cgukyawd24mayt8gpp4mhxue69uhhytnc9e3k7mgpz4mhxue69uhkg6nzv9ejuumpv34kytnrdaksjlyr9p"
        );
    }
}

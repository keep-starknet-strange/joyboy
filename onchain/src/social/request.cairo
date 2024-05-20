use core::clone::Clone;
use core::option::OptionTrait;
use core::traits::Destruct;
use core::serde::Serde;
use core::byte_array::ByteArrayTrait;
use core::traits::TryInto;
use core::traits::Into;
use core::fmt::Display;

use starknet::{secp256k1::{Secp256k1Point}, secp256_trait::{Secp256Trait, Secp256PointTrait}};
use joyboy::bip340;

#[derive(Copy, Drop, Debug)]
pub struct Signature {
    r: u256,
    s: u256
}

#[derive(Drop)]
pub struct SocialRequest<C, +Display<C>> {
    pubkey: u256,
    created_at: u64,
    kind: u16,
    tags: ByteArray, // we don't need to look inside the tags(at least for now)
    content: C,
    sig: Signature
}

pub fn verify<C, +Display<C>>(request: @SocialRequest<C>) -> bool {
    // TODO: implement verification
    println!("{}", request.pubkey);
    println!("{}", request.content);
    println!("{:?}", request.sig);

    let valid: bool = bip340::verify(
        *request.pubkey, *request.sig.r, *request.sig.s, request.tags.clone()
    );

    valid
}

pub trait Summary<T> {
    fn summarize(self: @T) -> ByteArray;
}

#[derive(Drop)]
pub struct Tweet {
    pub username: ByteArray,
    pub content: ByteArray,
    pub reply: bool,
    pub retweet: bool,
}

impl TweetSummary of Summary<Tweet> {
    fn summarize(self: @Tweet) -> ByteArray {
        format!("{}: {}", self.username, self.content)
    }
}

#[cfg(test)]
mod tests {
    use super::{Signature, SocialRequest, verify};

    #[test]
    fn test_wip() {
        // TODO: complete the test
        let r: SocialRequest<ByteArray> = SocialRequest {
            pubkey: 123_u256,
            created_at: 1_u64,
            kind: 0_u16,
            tags: "",
            content: "abc",
            sig: Signature { r: 1_u256, s: 2_u256 }
        };
        verify(@r);
    }
}

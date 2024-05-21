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
    id: u256,
    pubkey: u256,
    created_at: u64,
    kind: u16,
    tags: ByteArray, // we don't need to look inside the tags(at least for now)
    content: C,
    sig: Signature
}

impl U256IntoByteArray of Into<u256, ByteArray> {
    fn into(self: u256) -> ByteArray {
        let mut ba = Default::default();
        ba.append_word(self.high.into(), 16);
        ba.append_word(self.low.into(), 16);
        ba
    }
}

pub fn verify<C, +Display<C>>(request: @SocialRequest<C>) -> bool {
    let m: u256 = *request.id;
    let valid: bool = bip340::verify(*request.pubkey, *request.sig.r, *request.sig.s, m.into());

    valid
}

#[cfg(test)]
mod tests {
    use core::traits::Into;
    use core::traits::TryInto;
    use super::{Signature, SocialRequest, verify};

    #[test]
    fn test_wip() {
        let r: SocialRequest<ByteArray> = SocialRequest {
            id: 0xe915e9770219cd6c5ade1847d592d60e5d93a2340be41849724b8a385e90a157,
            pubkey: 0xa2611fdbcbcc1e43ef809341ddef4a98c15ff6e6410ff7ed0c2b1c4f2a2cc2f5,
            created_at: 1716282455,
            kind: 1,
            tags: "",
            content: "123",
            sig: Signature {
                r: 0x5d60e3186e9e398509573ceba5700185d188198342c3d9003349cf120bc64461,
                s: 0xe8eede47c034f8bc1ad5c18daec0fb36abc8c750acd47977d1c39d1637a8e1b3
            }
        };
        assert!(verify(@r));
    }
}

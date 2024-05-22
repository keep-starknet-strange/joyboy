use core::to_byte_array::FormatAsByteArray;
use core::fmt::Display;
use core::traits::Into;
use joyboy::utils::{compute_sha256_byte_array};
use joyboy::bip340;

const TWO_POW_32: u128 = 0x100000000;
const TWO_POW_64: u128 = 0x10000000000000000;
const TWO_POW_96: u128 = 0x1000000000000000000000000;

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

impl U256IntoByteArray of Into<u256, ByteArray> {
    fn into(self: u256) -> ByteArray {
        let mut ba = Default::default();
        ba.append_word(self.high.into(), 16);
        ba.append_word(self.low.into(), 16);
        ba
    }
}

pub fn verify<C, +Display<C>>(request: @SocialRequest<C>) -> bool {
    let id = @format!(
        "[0,\"{}\",{},{},{},\"{}\"]",
        request.pubkey.format_as_byte_array(16),
        request.created_at,
        request.kind,
        request.tags,
        request.content
    );

    let [x0, x1, x2, x3, x4, x5, x6, x7] = compute_sha256_byte_array(id);

    let m: ByteArray = u256 {
        high: x0.into() * TWO_POW_96 + x1.into() * TWO_POW_64 + x2.into() * TWO_POW_32 + x3.into(),
        low: x4.into() * TWO_POW_96 + x5.into() * TWO_POW_64 + x6.into() * TWO_POW_32 + x7.into(),
    }
        .into();

    let is_valid: bool = bip340::verify(*request.pubkey, *request.sig.r, *request.sig.s, m);
    is_valid
}

#[cfg(test)]
mod tests {
    use super::{Signature, SocialRequest, verify};

    // {
    //     kind: 1,
    //     created_at: 1716285235,
    //     tags: [],
    //     content: 'hello',
    //     pubkey: 'ef4082f31f1cb99a8418b73f6101da5bbb3b82e363f458e9ae945339b4b4e68a',
    //     id: '8d134f2d42b0b5f04c909e17e9cbc9cca405fb985dddfe5b516d47b5c0a57a71',
    //     sig:
    //
    //
    //
    //
    //     
    //     'fbbe47a42df4b01348982882bb0f622f8eb6802d5c6d9d8779b773a22753e2cc14058232c01aad1f90ee1f34cf8b0e5d0678435890a8bdcfda8f361908486d48',
    // }
    //
    //
    //
    //
    //
    // 
    // [0,"ef4082f31f1cb99a8418b73f6101da5bbb3b82e363f458e9ae945339b4b4e68a",1716285235,1,[],"hello"]

    #[test]
    fn test_wip() {
        let r: SocialRequest<ByteArray> = SocialRequest {
            pubkey: 0xa2611fdbcbcc1e43ef809341ddef4a98c15ff6e6410ff7ed0c2b1c4f2a2cc2f5_u256,
            created_at: 1716380267_u64,
            kind: 1_u16,
            tags: "[]",
            content: "abc",
            sig: Signature {
                r: 0xd6891392ca5384da7b3e471380c9927a66a71c3cf9f3e6cd4d69813fd5258274_u256,
                s: 0x39cd462e61f6e4a7a677989da9fe6625c45979f6e23513bd8eaa81aa5c38c693_u256
            }
        };

        assert!(verify(@r));
    }

    #[test]
    fn test_wip1() {
        let r: SocialRequest<ByteArray> = SocialRequest {
            pubkey: 0xa2611fdbcbcc1e43ef809341ddef4a98c15ff6e6410ff7ed0c2b1c4f2a2cc2f5_u256,
            created_at: 1716387881_u64,
            kind: 1_u16,
            tags: "[]",
            content: "123",
            sig: Signature {
                r: 0x15a429bed0fc7501354a40bc754c8e281a97c35eab87867d4be481693bae2f89_u256,
                s: 0xdd6e0b9a4aad519179a6ff9ccc9485c04fd3e2c247001ea95c6909e19010d11d_u256
            }
        };

        assert!(verify(@r));
    }

    #[test]
    fn test_wip3() {
        let r: SocialRequest<ByteArray> = SocialRequest {
            pubkey: 0xa2611fdbcbcc1e43ef809341ddef4a98c15ff6e6410ff7ed0c2b1c4f2a2cc2f5_u256,
            created_at: 1716388090_u64,
            kind: 1_u16,
            tags: "[]",
            content: "joyboy",
            sig: Signature {
                r: 0x966a0cc963ad6c3f6ae73e58e6d56840ec03cb7c092fb929f779394b02331b4a_u256,
                s: 0xa1075eb8e5d7b767a8c1141de639bb7ce5b0b01e196fae507fe12e08a3d9b998_u256
            }
        };

        assert!(verify(@r));
    }
}


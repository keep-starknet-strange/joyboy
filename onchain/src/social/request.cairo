use core::to_byte_array::FormatAsByteArray;
use core::fmt::Display;
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

pub fn verify<C, +Display<C>>(request: @SocialRequest<C>) -> bool {
    // [0,"ef4082f31f1cb99a8418b73f6101da5bbb3b82e363f458e9ae945339b4b4e68a",1716285235,1,[],"hello"]

    let id = @format!(
        "[0,\"{}\",{},{},{},\"{}\"]",
        request.pubkey.format_as_byte_array(16),
        request.created_at,
        request.kind,
        request.tags,
        request.content
    );

    let [x0, x1, x2, x3, x4, x5, x6, x7] = compute_sha256_byte_array(id);

    let m = u256 {
        high: x0.into() * TWO_POW_96 + x1.into() * TWO_POW_64 + x2.into() * TWO_POW_32 + x3.into(),
        low: x4.into() * TWO_POW_96 + x5.into() * TWO_POW_64 + x6.into() * TWO_POW_32 + x7.into(),
    }
        .format_as_byte_array(16);

    println!("id: {}", id);
    println!("m: {}", m);

    bip340::verify(*request.pubkey, *request.sig.r, *request.sig.s, m)
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
    //     sig: 'fbbe47a42df4b01348982882bb0f622f8eb6802d5c6d9d8779b773a22753e2cc14058232c01aad1f90ee1f34cf8b0e5d0678435890a8bdcfda8f361908486d48',
    // }
    // [0,"ef4082f31f1cb99a8418b73f6101da5bbb3b82e363f458e9ae945339b4b4e68a",1716285235,1,[],"hello"]

    #[test]
    fn test_wip() {
        let r: SocialRequest<ByteArray> = SocialRequest {
            //id: 8d134f2d42b0b5f04c909e17e9cbc9cca405fb985dddfe5b516d47b5c0a57a71
            pubkey: 0xef4082f31f1cb99a8418b73f6101da5bbb3b82e363f458e9ae945339b4b4e68a_u256,
            created_at: 1716285235,
            kind: 1,
            tags: "[]",
            content: "hello",
            sig: Signature {
                r: 0xfbbe47a42df4b01348982882bb0f622f8eb6802d5c6d9d8779b773a22753e2cc_u256,
                s: 0x14058232c01aad1f90ee1f34cf8b0e5d0678435890a8bdcfda8f361908486d48_u256
            }
        };
        assert!(verify(@r));
    }
}

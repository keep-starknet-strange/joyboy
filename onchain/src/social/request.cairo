use core::fmt::Display;

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
    // println!("{}", request.pubkey);
    // println!("{}", request.content);
    // println!("{:?}", request.sig);
    false
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

use core::fmt::Display;
use core::to_byte_array::FormatAsByteArray;
use core::traits::Into;
use joyboy::bip340;
use joyboy::utils::{compute_sha256_byte_array};

const TWO_POW_32: u128 = 0x100000000;
const TWO_POW_64: u128 = 0x10000000000000000;
const TWO_POW_96: u128 = 0x1000000000000000000000000;

#[derive(Copy, Drop, Debug, Serde)]
pub struct Signature {
    pub r: u256,
    pub s: u256
}

#[derive(Debug, Drop, Serde)]
pub struct SocialRequest<C> {
    pub public_key: u256,
    pub created_at: u64,
    pub kind: u16,
    pub tags: ByteArray, // we don't need to look inside the tags(at least for now)
    pub content: C,
    pub sig: Signature
}

pub trait Encode<T> {
    fn encode(self: @T) -> @ByteArray;
}

#[generate_trait]
pub impl SocialRequestImpl<C, +Encode<C>> of SocialRequestTrait<C> {
    fn verify(self: @SocialRequest<C>) -> Option<u256> {
        let id = @format!(
            "[0,\"{}\",{},{},{},\"{}\"]",
            self.public_key.format_as_byte_array(16),
            self.created_at,
            self.kind,
            self.tags,
            self.content.encode()
        );

        let [x0, x1, x2, x3, x4, x5, x6, x7] = compute_sha256_byte_array(id);

        let mut ba = Default::default();
        ba.append_word(x0.into(), 4);
        ba.append_word(x1.into(), 4);
        ba.append_word(x2.into(), 4);
        ba.append_word(x3.into(), 4);
        ba.append_word(x4.into(), 4);
        ba.append_word(x5.into(), 4);
        ba.append_word(x6.into(), 4);
        ba.append_word(x7.into(), 4);

        if bip340::verify(*self.public_key, *self.sig.r, *self.sig.s, ba) {
            Option::Some(
                u256 {
                    high: x0.into() * TWO_POW_96
                        + x1.into() * TWO_POW_64
                        + x2.into() * TWO_POW_32
                        + x3.into(),
                    low: x4.into() * TWO_POW_96
                        + x5.into() * TWO_POW_64
                        + x6.into() * TWO_POW_32
                        + x7.into(),
                }
            )
        } else {
            Option::None
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{Encode, Signature, SocialRequest, SocialRequestTrait};

    impl ByteArrayEncode of Encode<ByteArray> {
        fn encode(self: @ByteArray) -> @ByteArray {
            self
        }
    }

    #[test]
    fn verify_valid_signature() {
        let r: SocialRequest<ByteArray> = SocialRequest {
            public_key: 0xa2611fdbcbcc1e43ef809341ddef4a98c15ff6e6410ff7ed0c2b1c4f2a2cc2f5_u256,
            created_at: 1716380267_u64,
            kind: 1_u16,
            tags: "[]",
            content: "abc",
            sig: Signature {
                r: 0xd6891392ca5384da7b3e471380c9927a66a71c3cf9f3e6cd4d69813fd5258274_u256,
                s: 0x39cd462e61f6e4a7a677989da9fe6625c45979f6e23513bd8eaa81aa5c38c693_u256
            }
        };

        assert!(r.verify().is_some());
    }

    #[test]
    fn verify_signature_long_content() {
        let r: SocialRequest<ByteArray> = SocialRequest {
            public_key: 0xa2611fdbcbcc1e43ef809341ddef4a98c15ff6e6410ff7ed0c2b1c4f2a2cc2f5_u256,
            created_at: 1716403778_u64,
            kind: 1_u16,
            tags: "[]",
            content: "nprofile1qys8wumn8ghj7un9d3shjtn2daukymme9e3k7mtdw4hxjare9e3k7mgqyzzxqw6wxqyyqqmv4rxgz2l0ej8zgrqfkuupycuatnwcannad6ayqx7zdcy send 1 USDC to nprofile1qqs2sa3zk4a49umxg4lgvlsaenrqaf33ejkffd78f2cgy4xy38h393s2w22mm",
            sig: Signature {
                r: 0x4fda18c929f820f7f93f310f4fa9a8f2efcdd544539f4ce24fe2daf4f68d0b2d_u256,
                s: 0x279537893013f5849a716ac48e89ab4f8ce94871986326494c7311fc956639c3_u256
            }
        };

        assert!(r.verify().is_some());
    }

    #[test]
    fn verify_valid_signature_tags() {
        let r: SocialRequest<ByteArray> = SocialRequest {
            public_key: 0xcbddbb8b79e395d6458b49aa315b74fcc26d4d8d722e0a6421b4e04a612fc51c_u256,
            created_at: 1716285235_u64,
            kind: 1_u16,
            tags: "[[\"e\",\"5c83da77af1dec6d7289834998ad7aafbd9e2191396d75ec3cc27f5a77226f36\"]]",
            content: "joyboy",
            sig: Signature {
                r: 0x206e086fe298bf0733b0b22316721636ae7d8ce025c76baf83b8a31efaec8821_u256,
                s: 0x494452ba56fd465a0d69baa1ff4af9efcb1d0af8f107473ce33877d7a1034a8e_u256
            }
        };

        assert!(r.verify().is_some());
    }

    #[test]
    fn verify_invalid_tags() {
        // valid tags =
        // "[[\"e\",\"5c83da77af1dec6d7289834998ad7aafbd9e2191396d75ec3cc27f5a77226f36\"]]"
        let r: SocialRequest<ByteArray> = SocialRequest {
            public_key: 0xcbddbb8b79e395d6458b49aa315b74fcc26d4d8d722e0a6421b4e04a612fc51c_u256,
            created_at: 1716285235_u64,
            kind: 1_u16,
            tags: "[]",
            content: "joyboy",
            sig: Signature {
                r: 0x206e086fe298bf0733b0b22316721636ae7d8ce025c76baf83b8a31efaec8821_u256,
                s: 0x494452ba56fd465a0d69baa1ff4af9efcb1d0af8f107473ce33877d7a1034a8e_u256
            }
        };

        assert!(r.verify().is_none());
    }

    #[test]
    fn verify_invalid_content() {
        // valid content =
        // "nprofile1qys8wumn8ghj7un9d3shjtn2daukymme9e3k7mtdw4hxjare9e3k7mgqyzzxqw6wxqyyqqmv4rxgz2l0ej8zgrqfkuupycuatnwcannad6ayqx7zdcy
        // send 1 USDC to nprofile1qqs2sa3zk4a49umxg4lgvlsaenrqaf33ejkffd78f2cgy4xy38h393s2w22mm"
        let r: SocialRequest<ByteArray> = SocialRequest {
            public_key: 0xa2611fdbcbcc1e43ef809341ddef4a98c15ff6e6410ff7ed0c2b1c4f2a2cc2f5_u256,
            created_at: 1716403778_u64,
            kind: 1_u16,
            tags: "[]",
            content: "",
            sig: Signature {
                r: 0x4fda18c929f820f7f93f310f4fa9a8f2efcdd544539f4ce24fe2daf4f68d0b2d_u256,
                s: 0x279537893013f5849a716ac48e89ab4f8ce94871986326494c7311fc956639c3_u256
            }
        };

        assert!(r.verify().is_none());
    }

    #[test]
    fn verify_invalid_public_key() {
        // valid public_key =
        // 0xa2611fdbcbcc1e43ef809341ddef4a98c15ff6e6410ff7ed0c2b1c4f2a2cc2f5_u256
        let r: SocialRequest<ByteArray> = SocialRequest {
            public_key: 0xa2611fdbcbcc1e43ef809341ddef4a98c15ff6e6410ff7ed0c2b1c4f2a2cc2f4_u256,
            created_at: 1716380267_u64,
            kind: 1_u16,
            tags: "[]",
            content: "abc",
            sig: Signature {
                r: 0xd6891392ca5384da7b3e471380c9927a66a71c3cf9f3e6cd4d69813fd5258274_u256,
                s: 0x39cd462e61f6e4a7a677989da9fe6625c45979f6e23513bd8eaa81aa5c38c693_u256
            }
        };

        assert!(r.verify().is_none());
    }

    #[test]
    fn verify_invalid_timestamp() {
        // valid timestamp = 1716285235
        let r: SocialRequest<ByteArray> = SocialRequest {
            public_key: 0xcbddbb8b79e395d6458b49aa315b74fcc26d4d8d722e0a6421b4e04a612fc51c_u256,
            created_at: 1716285236_u64,
            kind: 1_u16,
            tags: "[[\"e\",\"5c83da77af1dec6d7289834998ad7aafbd9e2191396d75ec3cc27f5a77226f36\"]]",
            content: "joyboy",
            sig: Signature {
                r: 0x206e086fe298bf0733b0b22316721636ae7d8ce025c76baf83b8a31efaec8821_u256,
                s: 0x494452ba56fd465a0d69baa1ff4af9efcb1d0af8f107473ce33877d7a1034a8e_u256
            }
        };

        assert!(r.verify().is_none());
    }

    #[test]
    fn verify_invalid_signature_r() {
        // valid sig[0:32] = 0x206e086fe298bf0733b0b22316721636ae7d8ce025c76baf83b8a31efaec8821
        let r: SocialRequest<ByteArray> = SocialRequest {
            public_key: 0xcbddbb8b79e395d6458b49aa315b74fcc26d4d8d722e0a6421b4e04a612fc51c_u256,
            created_at: 1716285235_u64,
            kind: 1_u16,
            tags: "[[\"e\",\"5c83da77af1dec6d7289834998ad7aafbd9e2191396d75ec3cc27f5a77226f36\"]]",
            content: "joyboy",
            sig: Signature {
                r: 0x206e086fe298bf0733b0b22316721636ae7d8ce025c76baf83b8a31efaec8822_u256,
                s: 0x494452ba56fd465a0d69baa1ff4af9efcb1d0af8f107473ce33877d7a1034a8e_u256
            }
        };

        assert!(r.verify().is_none());
    }

    #[test]
    fn verify_invalid_signature_s() {
        // valid sig[32:64] = 0x494452ba56fd465a0d69baa1ff4af9efcb1d0af8f107473ce33877d7a1034a8e
        let r: SocialRequest<ByteArray> = SocialRequest {
            public_key: 0xcbddbb8b79e395d6458b49aa315b74fcc26d4d8d722e0a6421b4e04a612fc51c_u256,
            created_at: 1716285235_u64,
            kind: 1_u16,
            tags: "[[\"e\",\"5c83da77af1dec6d7289834998ad7aafbd9e2191396d75ec3cc27f5a77226f36\"]]",
            content: "joyboy",
            sig: Signature {
                r: 0x206e086fe298bf0733b0b22316721636ae7d8ce025c76baf83b8a31efaec8821_u256,
                s: 0x494452ba56fd465a0d69baa1ff4af9efcb1d0af8f107473ce33877d7a1034a8a_u256
            }
        };

        assert!(r.verify().is_none());
    }
}


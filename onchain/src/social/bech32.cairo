use core::array::ArrayTrait;
use core::byte_array::ByteArrayTrait;
use core::cmp::min;
// TODO: uncomment once Cairo 2.7 is available
// use core::array::ToSpanTrait;
use core::option::OptionTrait;
use core::to_byte_array::FormatAsByteArray;
//! bech32 encoding implementation

use core::traits::{Into, TryInto};

use joyboy::utils::{shl, shr};

//! bech32 encoding implementation
//! Spec: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
//! Sample implementations:
//! https://github.com/sipa/bech32/blob/master/ref/javascript/bech32.js#L86
//! https://github.com/paulmillr/scure-base/blob/main/index.ts#L479

// const GENERATOR: [
//     felt252
//     ; 5] = [
//     1, 2, 3, 4
//     ];

fn polymod(values: Array<u8>) -> u32 {
    let generator = array![
        0x3b6a57b2_u32, 0x26508e6d_u32, 0x1ea119fa_u32, 0x3d4233dd_u32, 0x2a1462b3_u32
    ];
    let generator = generator.span();

    let mut chk = 1_u32;

    let len = values.len();
    let mut p: usize = 0;
    while p != len {
        let top = shr(chk, 25);
        chk = shl((chk & 0x1ffffff_u32), 5) ^ (*values.at(p)).into();
        let mut i = 0_usize;
        while i != 5 {
            if shr(top, i) & 1_u32 != 0 {
                chk = chk ^ *generator.at(i.into());
            }
            i += 1;
        };
        p += 1;
    };

    chk
}

fn hrp_expand(hrp: @Array<u8>) -> Array<u8> {
    let mut r: Array<u8> = ArrayTrait::new();

    let len = hrp.len();
    let mut i = 0;
    while i != len {
        r.append(shr(*hrp.at(i), 5));
        i += 1;
    };
    r.append(0);

    let len = hrp.len();
    let mut i = 0;
    while i != len {
        r.append(*hrp.at(i) & 31);
        i += 1;
    };

    r
}

fn convert_bytes_to_5bit_chunks(bytes: @Array<u8>) -> Array<u8> {
    let mut r = ArrayTrait::new();

    let len = bytes.len();
    let mut i = 0;

    let mut acc = 0_u8;
    let mut missing_bits = 5_u8;

    while i != len {
        let mut byte: u8 = *bytes.at(i);
        let mut bits_left = 8_u8;
        loop {
            let chunk_size = min(missing_bits, bits_left);
            let chunk = shr(byte, 8 - chunk_size);
            r.append(acc + chunk);
            byte = shl(byte, chunk_size);
            bits_left -= chunk_size;
            if bits_left < 5 {
                acc = shr(byte, 3);
                missing_bits = 5 - bits_left;
                break ();
            } else {
                acc = 0;
                missing_bits = 5
            }
        };
        i += 1;
    };
    if missing_bits < 5 {
        r.append(acc);
    }
    r
}

impl ByteArrayTraitIntoArray of Into<@ByteArray, Array<u8>> {
    fn into(self: @ByteArray) -> Array<u8> {
        let mut r = ArrayTrait::new();
        let len = self.len();
        let mut i = 0;
        while i != len {
            r.append(self.at(i).unwrap());
            i += 1;
        };
        r
    }
}

fn checksum(hrp: @ByteArray, data: @Array<u8>) -> Array<u8> {
    let mut values = ArrayTrait::new();

    values.append_span(hrp_expand(@hrp.into()).span());
    values.append_span(data.span());
    let the_data: Array<u8> = array![0, 0, 0, 0, 0, 0];
    values.append_span(the_data.span());

    let m = polymod(values) ^ 1;

    let mut r = ArrayTrait::new();
    r.append((shr(m, 25) & 31).try_into().unwrap());
    r.append((shr(m, 20) & 31).try_into().unwrap());
    r.append((shr(m, 15) & 31).try_into().unwrap());
    r.append((shr(m, 10) & 31).try_into().unwrap());
    r.append((shr(m, 5) & 31).try_into().unwrap());
    r.append((m & 31).try_into().unwrap());

    r
}

pub fn encode(hrp: @ByteArray, data: @ByteArray, limit: usize) -> ByteArray {
    // change into an array and a const
    let alphabet: ByteArray = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

    let data_5bits = convert_bytes_to_5bit_chunks(@data.into());

    let cs = checksum(hrp, @data_5bits);

    let mut combined = ArrayTrait::new();
    combined.append_span(data_5bits.span());
    combined.append_span(cs.span());

    let mut encoded: ByteArray = Default::default();
    let mut i = 0;
    let len = combined.len();
    while i != len {
        encoded.append_byte(alphabet.at((*combined.at(i)).into()).unwrap());
        i += 1;
    };

    format!("{hrp}1{encoded}")
}

#[cfg(test)]
mod tests {
    // test data generated with: https://slowli.github.io/bech32-buffer/
    use super::encode;

    #[test]
    fn test_bech32() {
        assert_eq!(encode(@"abc", @"\x64\x65\x66", 90), "abc1v3jkv2rtp78");
        assert_eq!(encode(@"abc", @"\x64\x65\x66\x67", 90), "abc1v3jkveceusavp");
        assert_eq!(encode(@"abc", @"\x01", 90), "abc1qy928epu");
        assert_eq!(encode(@"abcd", @"\x01", 90), "abcd1qynxpyxs");
        assert_eq!(encode(@"abcd", @"\x00\x00", 90), "abcd1qqqqzclr2u");
        assert_eq!(encode(@"abcd", @"\x00\x00\x00\x00", 90), "abcd1qqqqqqqgf3j03");
        assert_eq!(encode(@"abcdef", @"\x00\x00\x00\x00", 90), "abcdef1qqqqqqqex27k2");
    }
}

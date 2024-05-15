use core::traits::Into;
use core::array::ToSpanTrait;
use core::option::OptionTrait;
use core::array::ArrayTrait;
use core::byte_array::ByteArrayTrait;
use core::integer::{ u32_wide_mul, BoundedInt };

//! bech32 encoding implementation
//! Spec: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
//! Sample implementations:
//! https://github.com/sipa/bech32/blob/master/ref/javascript/bech32.js#L86
//! https://github.com/paulmillr/scure-base/blob/main/index.ts#L479

#[inline]
fn pow2(n: u32) -> u32 {
    match n {
        0 =>  0b1,
        1 =>  0b10,
        2 =>  0b100,
        3 =>  0b1000,
        4 =>  0b10000,
        5 =>  0b100000,
        6 =>  0b1000000,
        7 =>  0b10000000,
        8 =>  0b100000000,
        9 =>  0b1000000000,
        10 => 0b10000000000,
        11 => 0b100000000000,
        12 => 0b1000000000000,
        13 => 0b10000000000000,
        14 => 0b100000000000000,
        15 => 0b1000000000000000,
        16 => 0b10000000000000000,
        17 => 0b100000000000000000,
        18 => 0b1000000000000000000,
        19 => 0b10000000000000000000,
        20 => 0b100000000000000000000,
        21 => 0b1000000000000000000000,
        22 => 0b10000000000000000000000,
        23 => 0b100000000000000000000000,
        24 => 0b1000000000000000000000000,
        25 => 0b10000000000000000000000000,
        _ => core::panic_with_felt252('n = {n} ouf of range'),
    }    
}

#[inline]
fn shr<V, N, +Drop<V>, +Div<V>, +Into<N, u32>, +Into<u32, V>>(v: V, n: N) -> V {
    v / pow2(n.into()).into()
}

#[inline]
fn shl5(x: u32) -> u32 {
    (u32_wide_mul(x, 32_u32) & BoundedInt::<u32>::max().into()).try_into().unwrap()
}

#[inline]
fn shr5(x: u8) -> u8 {
    x / 32_u8.into()
}

fn polymod(values: Array<u8>) -> u32 {

    let generator = array![0x3b6a57b2_u32, 0x26508e6d_u32, 0x1ea119fa_u32, 0x3d4233dd_u32, 0x2a1462b3_u32];
    let generator = generator.span();

    println!("{}", generator.at(0_usize));

    let mut chk = 1_u32;
    
    let len = values.len();
    let mut p: usize = 0;
    loop {
        if p == len {
            break ();
        }
        let top = shr(chk, 25_u8);
        chk = shl5(chk & 0x1ffffff_u32) ^ (*values.at(p)).into();
        let mut i = 0_usize;
        loop {
            if i == 5 {
                break ();
            }
            if shr(top, i) & 1_u32 != 0 {
                chk = chk ^ *generator.at(i.into());
            }
            i+=1;  
        };
        p+=1;
    };

    chk
}

fn hrp_expand(hrp: Array<u8>) -> Array<u8> {
    let mut r: Array<u8> = ArrayTrait::new();    

    let hrp = hrp.span();

    let len = hrp.len();
    let mut i = 0;
    loop {
        if i == len {
            break ();
        }
        r.append(shr5(*hrp.at(i)));
        i += 1;
    };
    r.append(0);

    let len = hrp.len();
    let mut i = 0;
    loop {
        if i == len {
            break ();
        }
        r.append(*hrp.at(i) & 31);
        i += 1;
    };

    r
}

impl ByteArrayTraitIntoArray of Into<@ByteArray, Array<u8>> {
    fn into(self: @ByteArray) -> Array<u8> {
        let mut r = ArrayTrait::new();
        let len = self.len();
        let mut i = 0;
        loop {
            if i == len {
                break ();
            }
            r.append(self.at(i).unwrap());
            i += 1;
        };
        r
    }
}

fn checksum(hrp: @ByteArray, data: @ByteArray) -> ByteArray {
    let mut values = ArrayTrait::new();

    values.append_span(hrp_expand(hrp.into()).span());
    let the_data: Array<u8> = data.into();
    values.append_span(the_data.span());
    let the_data: Array<u8> = array![0, 0, 0, 0, 0, 0];
    values.append_span(the_data.span());
  
    let m = polymod(values) ^ 1;

    let mut r = Default::default();
    r.append_byte((shr(m, 25_u8) & 31).try_into().unwrap());
    r.append_byte((shr(m, 20_u8) & 31).try_into().unwrap());
    r.append_byte((shr(m, 15_u8) & 31).try_into().unwrap());
    r.append_byte((shr(m, 10_u8) & 31).try_into().unwrap());
    r.append_byte((shr(m, 5_u8) & 31).try_into().unwrap());
    r.append_byte((m & 31).try_into().unwrap());

    r
}

pub fn encode(hrp: ByteArray, data: ByteArray, limit: usize) -> ByteArray {
    // change into an array and a const
    let alphabet: ByteArray = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

    let check_sum = checksum(@hrp, @data);

    let combined = ByteArrayTrait::concat(@data, @check_sum);

    let mut encoded: ByteArray = Default::default();

    let mut i = 0;
    let len = data.len();
    loop {
        if i == len {
            break ();
        }
        encoded.append_byte(alphabet.at(combined.at(i).unwrap().into()).unwrap());
        i += 1;
    };

    format!("{hrp}1{encoded}")
}

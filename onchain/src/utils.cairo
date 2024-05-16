use core::integer::{u32_wide_mul, u8_wide_mul, BoundedInt};

trait Pow2<V, N> {
    #[inline]
    fn pow2(n: N) -> V;
}

impl Pow2u8u8 of Pow2<u8, u8> {
    fn pow2(n: u8) -> u8 {
        match n {
            0 => 0b1,
            1 => 0b10,
            2 => 0b100,
            3 => 0b1000,
            4 => 0b10000,
            5 => 0b100000,
            6 => 0b1000000,
            7 => 0b10000000,
            _ => core::panic_with_felt252('n = {n} ouf of range'),
        }
    }
}

impl Pow2u32u32 of Pow2<u32, u32> {
    fn pow2(n: u32) -> u32 {
        match n {
            0 => 0b1,
            1 => 0b10,
            2 => 0b100,
            3 => 0b1000,
            4 => 0b10000,
            5 => 0b100000,
            6 => 0b1000000,
            7 => 0b10000000,
            8 => 0b100000000,
            9 => 0b1000000000,
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
            26 => 0b100000000000000000000000000,
            27 => 0b1000000000000000000000000000,
            28 => 0b10000000000000000000000000000,
            29 => 0b100000000000000000000000000000,
            30 => 0b1000000000000000000000000000000,
            31 => 0b10000000000000000000000000000000,
            _ => core::panic_with_felt252('n = {n} ouf of range'),
        }
    }
}


#[inline]
pub fn shr<V, N, +Drop<V>, +Div<V>, +Pow2<V, N>>(v: V, n: N) -> V {
    v / Pow2::pow2(n.into())
}

trait WideMul<V, W> {
    fn wide_mul(x: V, y: V) -> W;
}

impl WideMuluU32 of WideMul<u32, u64> {
    fn wide_mul(x: u32, y: u32) -> u64 {
        u32_wide_mul(x, y)
    }
}

impl WideMuluU8 of WideMul<u8, u16> {
    fn wide_mul(x: u8, y: u8) -> u16 {
        u8_wide_mul(x, y)
    }
}

#[inline]
pub fn shl<
    V,
    W,
    N,
    +BitAnd<W>,
    +Pow2<V, N>,
    +BoundedInt<V>,
    +WideMul<V, W>,
    +Into<V, W>,
    +TryInto<W, V>,
    +Drop<V>,
    +Drop<W>,
>(
    x: V, n: N
) -> V {
    (WideMul::wide_mul(x, Pow2::pow2(n)) & BoundedInt::<V>::max().into()).try_into().unwrap()
}

#[derive(Copy, Drop)]
pub struct NIP01Event {
    id: u256,
    pubkey: u256,
    created_at: u64,
    kind: u16,
    tags: Array<Array<ByteArray>>,
    content: ByteArray,
    sig_r: u256,
    sig_s: u256
}


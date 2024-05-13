#[derive(Copy, Drop)]
struct NIP01Event {
    id: u256,
    pubkey: u256,
    created_at: u64,
    kind: u16,
    tags: Array<ByteArray>,
    content: ByteArray,
    sig: u256
}


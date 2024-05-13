#[derive(Copy, Drop)]
#[derive(Copy, Drop)]
struct NIP01Event {
    id: ByteArray,
    pubkey: ByteArray,
    created_at: u64,
    kind: u16,
    tags: ArrayTrait<ByteArray>,
    content: ByteArray,
    sig: ByteArray
}


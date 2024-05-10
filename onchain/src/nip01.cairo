#[derive(Copy, Drop)]
struct NIP01Event {
    id: felt252,
    pubkey: felt252,
    created_at: u64,
    kind: u16,
    tags: List[List[felt252]]
    content: ByteArray,
    sig: felt252
}
// Generate interface using src5.rs
// -> Copy interface into a file and run `src5_rs parse <PATH_TO_CAIRO_FILE>`
// -> Note: You would need to define custom Structs and Enums in the file. 
pub const ISRC5_ID: felt252 = 0x3983c447d2357bbd8e577096a70949166b5337acbb2b66f279157b8f352ff8f;

// Below is the interface structure for generating the interface ID
// You can generate the ID using this tool: https://github.com/ericnordelo/src5-rs/tree/main?tab=readme-ov-file
struct Transfer {
    amount: u256,
    token: felt252,
    token_address: starknet::ContractAddress,
    joyboy: NostrProfile,
    recipient: NostrProfile,
}

struct SocialRequest<T> {
    public_key: u256,
    created_at: u64,
    kind: u16,
    tags: felt252,
    content: T,
    sig: Signature,
}

struct NostrProfile {
    public_key: u256,
    relays: felt252,
}

struct Signature {
    r: u256,
    s: u256,
}

trait ISocialAccount {
    fn get_public_key() -> u256;
    fn handle_transfer(request: SocialRequest<Transfer>);
}


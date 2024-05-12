use starknet::ContractAddress;

#[starknet::interface]
pub trait ISocialPayAccount<TContractState> {
    fn get_public_key(self: @TContractState) -> u256;
}

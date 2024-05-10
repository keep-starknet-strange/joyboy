#[starknet::contract]
pub mod SocialAccount {
    #[storage]
    struct Storage {
        public_key: felt252,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AccountCreated: AccountCreated,
    }

    #[constructor]
    fn constructor(ref self: ContractState, public_key: public_key) {
        self.public_key.write(public_key)
    }
//self.emit(AccountCreated { public_key: self.public_key });

}

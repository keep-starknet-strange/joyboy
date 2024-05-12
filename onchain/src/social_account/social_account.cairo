#[starknet::contract]
pub mod SocialPayAccount {
    use joyboy::social_account::ISocialPayAccount;


    #[storage]
    struct Storage {
        #[key]
        public_key: u256
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AccountCreated: AccountCreated,
    }

    #[derive(Drop, starknet::Event)]
    struct AccountCreated {
        #[key]
        public_key: u256
    }

    #[derive(Drop, Serde)]
    pub struct SocialAccountInitParams {
        pub public_key: u256
    }


    #[constructor]
    fn constructor(ref self: ContractState, init_params: SocialAccountInitParams) {
        self.public_key.write(init_params.public_key);
    }

    #[abi(embed_v0)]
    impl SocialPayAccount of ISocialPayAccount<ContractState> {
        fn get_public_key(self: @ContractState) -> u256 {
            self.public_key.read()
        }
    }
}

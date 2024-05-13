use starknet::{ContractAddress, get_caller_address, get_contract_address, contract_address_const};


#[starknet::interface]
pub trait ISocialPayAccount<TContractState> {
    fn get_public_key(self: @TContractState) -> u256;
}


#[starknet::contract]
pub mod SocialPayAccount {
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

    #[constructor]
    fn constructor(ref self: ContractState, public_key: u256) {
        self.public_key.write(public_key);
    }

    #[abi(embed_v0)]
    impl SocialPayAccount of super::ISocialPayAccount<ContractState> {
        fn get_public_key(self: @ContractState) -> u256 {
            self.public_key.read()
        }
    }
}

#[cfg(test)]
mod tests {
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, contract_address_const
    };
    use snforge_std as snf;
    use snforge_std::{declare, ContractClassTrait};
    use super::{ISocialPayAccountDispatcher, ISocialPayAccountDispatcherTrait};

    const public_key: u256 = 45;

    fn deploy_social_account() -> ContractAddress {
        let contract = declare("SocialPayAccount");

        let mut social_account_calldata = array![];
        public_key.serialize(ref social_account_calldata);

        contract.deploy(@social_account_calldata).unwrap()
    }

    #[test]
    fn test_get_public_key() {
        let contract_address = deploy_social_account();
        let dispatcher = ISocialPayAccountDispatcher { contract_address };

        let get_public_key = dispatcher.get_public_key();

        assert!(get_public_key == public_key, "Public key is not the same");
    }
}


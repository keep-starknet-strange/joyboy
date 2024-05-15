use starknet::{ContractAddress, get_caller_address, get_contract_address, contract_address_const};
// use traits::TryInto;
// use traits::Into;

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
        self.emit(AccountCreated { public_key: public_key });
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
    use core::traits::Into;
    use core::array::ArrayTrait;
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, contract_address_const
    };
    use snforge_std as snf;
    use snforge_std::{
        declare, ContractClassTrait, start_prank, stop_prank, CheatTarget, spy_events, SpyOn,
        EventSpy, EventFetcher, Event, EventAssertions
    };
    use super::{ISocialPayAccountDispatcher, ISocialPayAccountDispatcherTrait};


    const public_key: u256 = 45;

    fn deploy_social_account() -> ContractAddress {
        let contract = declare("SocialPayAccount");

        let mut social_account_calldata = array![];
        public_key.serialize(ref social_account_calldata);

        let address = contract.precalculate_address(@social_account_calldata);

        let mut spy = spy_events(SpyOn::One(address));

        let deployed_contract_address = contract.deploy(@social_account_calldata).unwrap();

        spy.fetch_events();

        assert(spy.events.len() == 1, 'there should be one event');

        let (_, event) = spy.events.at(0);
        assert(event.keys.at(0) == @selector!("AccountCreated"), 'Wrong event name');

        let key_felt252 = *event.keys.at(1);
        let key: u256 = key_felt252.into();
        assert(key == public_key, 'Wrong Public Key');

        deployed_contract_address
    }

    #[test]
    fn test_get_public_key() {
        let contract_address = deploy_social_account();
        let dispatcher = ISocialPayAccountDispatcher { contract_address };

        let get_public_key = dispatcher.get_public_key();

        assert!(get_public_key == public_key, "Public key is not the same");
    }
}


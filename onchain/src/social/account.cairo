use starknet::{ContractAddress, get_caller_address, get_contract_address, contract_address_const};
use super::profile::NostrProfile;
use super::request::SocialRequest;
use super::transfer::{Transfer};
use openzeppelin::introspection::src5::SRC5Component;
use openzeppelin::account::interface;


#[starknet::interface]
pub trait ISocialAccount<TContractState> {
    fn get_public_key(self: @TContractState) -> u256;
    fn handle_transfer_request(ref self: TContractState, request: SocialRequest<Transfer>);
}

#[starknet::contract]
pub mod SocialAccount {
    use super::SocialRequest;
    use super::Transfer;
    use openzeppelin::introspection::src5::SRC5Component;

    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;
    impl InternalImpl = SRC5Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[key]
        public_key: u256,
        #[substorage(v0)]
        src5: SRC5Component::Storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AccountCreated: AccountCreated,
        #[flat]
        SRC5Event: SRC5Component::Event
    }

    #[derive(Drop, starknet::Event)]
    struct AccountCreated {
        #[key]
        public_key: u256
    }

    const ISRC5_ID: felt252 = 0x123456789abcdef0;

    #[constructor]
    fn constructor(ref self: ContractState, public_key: u256,) {
        self.public_key.write(public_key);
        self.emit(AccountCreated { public_key: public_key });
        self.src5.register_interface(ISRC5_ID);
    }

    #[abi(embed_v0)]
    impl SocialAccount of super::ISocialAccount<ContractState> {
        fn get_public_key(self: @ContractState) -> u256 {
            self.public_key.read()
        }
        fn handle_transfer_request(
            ref self: ContractState, request: SocialRequest<Transfer>
        ) { // TODO: implement handle transfer logic
        }
    }

    #[external(v0)]
    fn is_supported_interface(self: @ContractState, interface_id: felt252) -> bool {
        self.src5.supports_interface(interface_id)
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
    use super::{
        ISocialAccountDispatcher, ISocialAccountDispatcherTrait, ISocialAccountSafeDispatcher,
        ISocialAccountSafeDispatcherTrait
    };
    use openzeppelin::account::interface;
    use openzeppelin::introspection::interface::ISRC5Dispatcher;
    use openzeppelin::introspection::interface::ISRC5DispatcherTrait;

    const public_key: u256 = 45;
    const ISRC5_ID: felt252 = 0x123456789abcdef0;


    fn deploy_social_account() -> ContractAddress {
        let contract = declare("SocialAccount").unwrap();

        let mut social_account_calldata = array![];
        public_key.serialize(ref social_account_calldata);

        let address = contract.precalculate_address(@social_account_calldata);

        let mut spy = spy_events(SpyOn::One(address));

        let (contract_address, _) = contract.deploy(@social_account_calldata).unwrap();

        spy.fetch_events();

        assert(spy.events.len() == 1, 'there should be one event');

        let (_, event) = spy.events.at(0);
        assert(event.keys.at(0) == @selector!("AccountCreated"), 'Wrong event name');

        let event_key = (*event.keys.at(1)).into();

        assert(event_key == public_key, 'Wrong Public Key');
        contract_address
    }

    #[test]
    fn test_supports_interface() {
        let contract_address = deploy_social_account();
        let dispatcher = ISRC5Dispatcher { contract_address };

        let supports_src5 = dispatcher.supports_interface(ISRC5_ID);

        assert!(supports_src5, "The contract does not support the ISRC5 interface");
    }
}

use starknet::{ContractAddress, get_caller_address, get_contract_address, contract_address_const};
use super::profile::NostrProfile;
use super::request::SocialRequest;
use super::transfer::{Transfer};
use joyboy::utils::{compute_sha256_byte_array};
use joyboy::bip340;


#[starknet::interface]
pub trait ISocialAccount<TContractState> {
    fn get_public_key(self: @TContractState) -> u256;
    fn handle_transfer_request(ref self: TContractState, request: SocialRequest<Transfer>);
}


#[starknet::contract]
pub mod SocialAccount {
    use super::SocialRequest;
    use super::Transfer;

    use openzeppelin::account::interface;
    use openzeppelin::introspection::interface::ISRC5;
    use openzeppelin::introspection::interface::ISRC5Camel;
    use openzeppelin::introspection::src5::SRC5;
    use openzeppelin::introspection::src5::unsafe_state as src5_state;
    use starknet::account::Call;
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    use starknet::get_tx_info;

    const TRANSACTION_VERSION: felt252 = 1;
    // 2**128 + TRANSACTION_VERSION
    const QUERY_VERSION: felt252 = 0x100000000000000000000000000000001;


    #[storage]
    struct Storage {
        #[key]
        public_key: u256,
        request_event: SocialRequest
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
    impl SRC6Impl of interface::ISRC6<ContractState> {
        fn __execute__(self: @ContractState, mut calls: Array<Call>) -> Array<Span<felt252>> {
            let sender = get_caller_address();
            assert(sender.is_zero(), 'Account: invalid caller');

            // Check tx version
            let tx_info = get_tx_info().unbox();
            let version = tx_info.version;
            if version != TRANSACTION_VERSION {
                assert(version == QUERY_VERSION, 'Account: invalid tx version');
            }

            _execute_calls(calls)
        }

        fn __validate__(self: @ContractState, mut calls: Array<Call>) -> felt252 {
            self.validate_transaction()
        }

        fn is_valid_signature(
            self: @ContractState, hash: felt252, signature: Array<felt252>
        ) -> felt252 {
            if self._is_valid_signature(hash, signature.span()) {
                starknet::VALIDATED
            } else {
                0
            }
        }
    }

    //
    // Internal
    //

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn validate_transaction(self: @ContractState) -> felt252 {
            let tx_info = get_tx_info().unbox();
            let tx_hash = tx_info.transaction_hash;
            let signature = tx_info.signature;
            assert(self._is_valid_signature(tx_hash, signature), 'Account: invalid signature');
            starknet::VALIDATED
        }

        fn _is_valid_signature(
            self: @ContractState, hash: felt252, signature: Span<felt252>,
        ) -> bool {
            let valid_length = signature.len() == 2_u32;

            let public_key = self.public_key.read();
            // how do i get the event message in order to use it here
            let id = @format!(
                "[0,\"{}\",{},{},{},\"{}\"]",
                public_key.format_as_byte_array(16),
                request_event.created_at,
                request_event.kind,
                request_event.tags,
                request_event.content.encode()
            );

            let [x0, x1, x2, x3, x4, x5, x6, x7] = compute_sha256_byte_array(id);

            let mut ba = Default::default();
            ba.append_word(x0.into(), 4);
            ba.append_word(x1.into(), 4);
            ba.append_word(x2.into(), 4);
            ba.append_word(x3.into(), 4);
            ba.append_word(x4.into(), 4);
            ba.append_word(x5.into(), 4);
            ba.append_word(x6.into(), 4);
            ba.append_word(x7.into(), 4);

            if valid_length {
                bip340::verify(public_key, *social_event.sig.r, *social_event.sig.s, ba)
            } else {
                false
            }
        }
    }

    #[private]
    fn _execute_calls(mut calls: Array<Call>) -> Array<Span<felt252>> {
        let mut res = ArrayTrait::new();
        loop {
            match calls.pop_front() {
                Option::Some(call) => {
                    let _res = _execute_single_call(call);
                    res.append(_res);
                },
                Option::None(_) => { break (); },
            };
        };
        res
    }

    #[private]
    fn _execute_single_call(call: Call) -> Span<felt252> {
        let Call { to, selector, calldata } = call;
        starknet::call_contract_syscall(to, selector, calldata.span()).unwrap()
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


    const public_key: u256 = 45;


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
    fn test_get_public_key() {
        let contract_address = deploy_social_account();
        let dispatcher = ISocialAccountDispatcher { contract_address };

        let get_public_key = dispatcher.get_public_key();

        assert!(get_public_key == 45, "Public key is not the same");
    }
}

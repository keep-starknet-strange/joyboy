use core::to_byte_array::{AppendFormattedToByteArray, FormatAsByteArray};
use joyboy::bip340;
use joyboy::utils::{compute_sha256_byte_array};
use starknet::{ContractAddress, get_caller_address, get_contract_address, contract_address_const};
use super::profile::NostrProfile;
use super::request::SocialRequest;
use super::transfer::Transfer;


#[starknet::interface]
pub trait ISocialAccount<TContractState> {
    fn get_public_key(self: @TContractState) -> u256;
    fn handle_transfer(ref self: TContractState, request: SocialRequest<Transfer>);
}


#[starknet::contract]
pub mod SocialAccount {
    use openzeppelin::account::interface;
    use openzeppelin::introspection::interface::ISRC5;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    // use openzeppelin::introspection::interface::ISRC5Camel;
    // use openzeppelin::introspection::src5::SRC5;
    // use openzeppelin::introspection::src5::unsafe_state as src5_state;
    use starknet::account::Call;
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    use starknet::get_tx_info;
    use super::super::request::{
        SocialRequest, SocialRequestImpl, SocialRequestTrait, Encode, Signature
    };
    use super::super::transfer::Transfer;

    const TRANSACTION_VERSION: felt252 = 1;
    // 2**128 + TRANSACTION_VERSION
    const QUERY_VERSION: felt252 = 0x100000000000000000000000000000001;


    #[storage]
    struct Storage {
        #[key]
        public_key: u256,
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
        fn handle_transfer(ref self: ContractState, request: SocialRequest<Transfer>) {
            assert!(request.public_key == self.public_key.read(), "wrong public_key");
        // assert!(request.verify());
        // let erc20 = IERC20Dispatcher { contract_address: request.content.token_address };
        // assert_eq!(erc20.symbol(), request.content.token);
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

            let mut res = ArrayTrait::new();
            loop {
                match calls.pop_front() {
                    Option::Some(call) => {
                        let Call { to, selector, calldata } = call;
                        let _res = starknet::call_contract_syscall(to, selector, calldata.span())
                            .unwrap();
                        res.append(_res);
                    },
                    Option::None(_) => { break (); },
                };
            };
            res
        }

        fn __validate__(self: @ContractState, mut calls: Array<Call>) -> felt252 {
            let tx_info = get_tx_info().unbox();
            let tx_hash = tx_info.transaction_hash;
            let signature = tx_info.signature;
            return self.is_valid_signature(tx_hash, signature);
        }

        fn is_valid_signature(
            self: @ContractState, hash: felt252, signature: Array<felt252>
        ) -> felt252 {
            assert(signature.len() == 2_u32, 'Invalid Signature Length');

            let public_key = self.public_key.read();

            let byte_array = format_as_byte_array(hash, 16);

            let verify_signature = bip340::verify(
                public_key, *signature.at(0_u32), *signature.at(1_u32), byte_array
            );

            if verify_signature {
                starknet::VALIDATED
            } else {
                0
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use core::array::ArrayTrait;
    use core::traits::Into;
    use openzeppelin::presets::ERC20Upgradeable;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::utils::serde::SerializedAppend;
    use snforge_std as snf;
    use snforge_std::{
        declare, ContractClassTrait, spy_events, SpyOn, EventSpy, EventFetcher, Event,
        EventAssertions
    };
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, contract_address_const
    };
    use super::super::profile::NostrProfile;

    use super::super::request::{SocialRequest, Signature, Encode};
    use super::super::transfer::Transfer;
    use super::{
        ISocialAccountDispatcher, ISocialAccountDispatcherTrait, ISocialAccountSafeDispatcher,
        ISocialAccountSafeDispatcherTrait
    };

    fn deploy_account(public_key: u256) -> ISocialAccountDispatcher {
        let contract = declare("SocialAccount").unwrap();

        let mut calldata = array![];
        public_key.serialize(ref calldata);

        let address = contract.precalculate_address(@calldata);

        let mut spy = spy_events(SpyOn::One(address));

        let (contract_address, _) = contract.deploy(@calldata).unwrap();

        spy.fetch_events();

        assert(spy.events.len() == 1, 'there should be one event');

        let (_, event) = spy.events.at(0);
        assert(event.keys.at(0) == @selector!("AccountCreated"), 'Wrong event name');

        let event_key = u256 {
            low: (*event.keys.at(1)).try_into().unwrap(),
            high: (*event.keys.at(2)).try_into().unwrap()
        };

        assert(event_key == public_key, 'Wrong Public Key');

        ISocialAccountDispatcher { contract_address }
    }

    fn deploy_erc20(
        name: ByteArray, symbol: ByteArray, initial_supply: u256, recipient: ContractAddress
    ) -> IERC20Dispatcher {
        let contract = declare("ERC20Upgradeable").unwrap();

        let mut calldata = array![];

        name.serialize(ref calldata);

        // calldata.append_serde(name);
        calldata.append_serde(symbol);
        calldata.append_serde(2 * initial_supply);
        calldata.append_serde(recipient);
        calldata.append_serde(recipient);

        let (contract_address, _) = contract.deploy(@calldata).unwrap();

        IERC20Dispatcher { contract_address }
    }

    #[test]
    fn get_public_key() {
        let public_key: u256 = 45;
        let account = deploy_account(public_key);
        assert!(account.get_public_key() == public_key, "wrong public_key");
    }

    #[test]
    fn handle_transfer() {
        let joyboy = NostrProfile {
            public_key: 0x84603b4e300840036ca8cc812befcc8e240c09b73812639d5cdd8ece7d6eba40,
            relays: array!["wss://relay.joyboy.community.com"]
        };

        let recipient_public_key =
            0x5b2b830f2778075ab3befb5a48c9d8138aef017fab2b26b5c31a2742a901afcc_u256;

        let recipient = NostrProfile { public_key: recipient_public_key, relays: array![] };

        let account = deploy_account(recipient_public_key);
        let erc20 = deploy_erc20("USDC token", "USDC", 100, account.contract_address);

        let transfer = Transfer {
            amount: 1,
            token: "USDC", // TODO: replace with erc20.symbol(), 
            token_address: erc20.contract_address,
            joyboy,
            recipient
        };

        // for test data see: https://replit.com/@maciejka/WanIndolentKilobyte-2

        let request = SocialRequest {
            public_key: recipient_public_key,
            created_at: 1716285235_u64,
            kind: 1_u16,
            tags: "[]",
            content: transfer,
            sig: Signature {
                r: 0x27e3728a7053522998d46a810d6c82a4c6167c84f4fee68125aba6628f98a1de_u256,
                s: 0x2311ab674f0dfcc0473e943e749c72fb330d40be11bc01296db5714f06221dde_u256
            }
        };

        account.handle_transfer(request);
    }
}

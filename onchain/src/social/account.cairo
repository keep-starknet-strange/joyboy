use starknet::account::Call;
use starknet::{ContractAddress, get_caller_address, get_contract_address, contract_address_const};
use super::profile::NostrProfile;
use super::request::SocialRequest;
use super::transfer::Transfer;


#[starknet::interface]
pub trait ISocialAccount<TContractState> {
    fn get_public_key(self: @TContractState) -> u256;
    fn handle_transfer(ref self: TContractState, request: SocialRequest<Transfer>);
// fn __execute__(self: @TContractState, calls: Array<Call>) -> Array<Span<felt252>>;
// fn __validate__(self: @TContractState, calls: Array<Call>) -> felt252;
// fn is_valid_signature(self: @TContractState, hash: felt252, signature: Array<felt252>) ->
// felt252;
}

#[starknet::interface]
pub trait ISRC6<TState> {
    fn __execute__(self: @TState, calls: Array<Call>) -> Array<Span<felt252>>;
    fn __validate__(self: @TState, calls: Array<Call>) -> felt252;
    fn is_valid_signature(self: @TState, hash: felt252, signature: Array<felt252>) -> felt252;
}


#[starknet::contract(account)]
pub mod SocialAccount {
    use core::num::traits::Zero;
    use joyboy::bip340;
    use joyboy::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use joyboy::utils::{
        MIN_TRANSACTION_VERSION, QUERY_VERSION, QUERY_OFFSET, execute_calls,
        is_valid_stark_signature
    };
    use starknet::account::Call;
    use starknet::{get_caller_address, get_contract_address, get_tx_info, ContractAddress};
    use super::ISRC6;

    use super::super::request::{
        SocialRequest, SocialRequestImpl, SocialRequestTrait, Encode, Signature
    };
    use super::super::transfer::Transfer;
    use super::{ISocialAccountDispatcher, ISocialAccountDispatcherTrait};

    #[storage]
    struct Storage {
        #[key]
        public_key: u256,
        transfers: LegacyMap<u256, bool>,
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
            // TODO: is this check necessary
            assert!(request.public_key == self.public_key.read(), "wrong sender");

            let erc20 = IERC20Dispatcher { contract_address: request.content.token_address };
            assert!(erc20.symbol() == request.content.token, "wrong token");

            let recipient = ISocialAccountDispatcher {
                contract_address: request.content.recipient_address
            };

            assert!(
                recipient.get_public_key() == request.content.recipient.public_key,
                "wrong recipient"
            );

            if let Option::Some(id) = request.verify() {
                assert!(!self.transfers.read(id), "double spend");
                self.transfers.write(id, true);
                erc20.transfer(request.content.recipient_address, request.content.amount);
            } else {
                panic!("can't verify signature");
            }
        }
    }

    #[abi(embed_v0)]
    impl ISRC6Impl of ISRC6<ContractState> {
        fn __execute__(self: @ContractState, calls: Array<Call>) -> Array<Span<felt252>> {
            assert!(get_caller_address().is_zero(), "invalid caller");

            // Check tx version
            let tx_info = get_tx_info().unbox();
            let tx_version: u256 = tx_info.version.into();
            // Check if tx is a query
            if (tx_version >= QUERY_OFFSET) {
                assert!(QUERY_OFFSET + MIN_TRANSACTION_VERSION <= tx_version, "invalid tx version");
            } else {
                assert!(MIN_TRANSACTION_VERSION <= tx_version, "invalid tx version");
            }

            execute_calls(calls)
        }

        fn __validate__(self: @ContractState, calls: Array<Call>) -> felt252 {
            let tx_info = get_tx_info().unbox();
            self._is_valid_signature(tx_info.transaction_hash, tx_info.signature)
        }

        fn is_valid_signature(
            self: @ContractState, hash: felt252, signature: Array<felt252>
        ) -> felt252 {
            self._is_valid_signature(hash, signature.span())
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _is_valid_signature(
            self: @ContractState, hash: felt252, signature: Span<felt252>
        ) -> felt252 {
            let public_key = self.public_key.read();

            let mut signature = signature;
            let r: u256 = Serde::deserialize(ref signature).expect('invalid signature format');
            let s: u256 = Serde::deserialize(ref signature).expect('invalid signature format');

            let hash: u256 = hash.into();
            let mut hash_as_ba = Default::default();
            hash_as_ba.append_word(hash.high.into(), 16);
            hash_as_ba.append_word(hash.low.into(), 16);

            if bip340::verify(public_key, r, s, hash_as_ba) {
                starknet::VALIDATED
            } else {
                0
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use core::array::SpanTrait;
    use core::traits::Into;
    use joyboy::erc20::{ERC20, IERC20Dispatcher, IERC20DispatcherTrait};
    use snforge_std::{
        declare, ContractClass, ContractClassTrait, spy_events, SpyOn, EventSpy, EventFetcher,
        Event, EventAssertions, cheat_transaction_hash_global, cheat_signature_global,
        stop_cheat_transaction_hash_global, stop_cheat_signature_global
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

    use super::{ISRC6Dispatcher, ISRC6DispatcherTrait};

    fn declare_account() -> ContractClass {
        declare("SocialAccount").unwrap()
    }

    fn declare_erc20() -> ContractClass {
        declare("ERC20").unwrap()
    }

    fn deploy_account(class: ContractClass, public_key: u256) -> ISocialAccountDispatcher {
        let mut calldata = array![];
        public_key.serialize(ref calldata);

        let address = class.precalculate_address(@calldata);

        let mut spy = spy_events(SpyOn::One(address));

        let (contract_address, _) = class.deploy(@calldata).unwrap();

        spy.fetch_events();

        assert(spy.events.len() == 1, 'there should be one event');

        // TODO: deserialize event instead of manual decoding
        let (_, event) = spy.events.at(0);
        assert(event.keys.at(0) == @selector!("AccountCreated"), 'wrong event name');

        let event_key = u256 {
            low: (*event.keys.at(1)).try_into().unwrap(),
            high: (*event.keys.at(2)).try_into().unwrap()
        };

        assert(event_key == public_key, 'wrong public key');

        ISocialAccountDispatcher { contract_address }
    }

    fn deploy_erc20(
        class: ContractClass,
        name: felt252,
        symbol: felt252,
        initial_supply: u256,
        recipient: ContractAddress
    ) -> IERC20Dispatcher {
        let mut calldata = array![];

        name.serialize(ref calldata);
        symbol.serialize(ref calldata);
        (2 * initial_supply).serialize(ref calldata);
        recipient.serialize(ref calldata);
        18_u8.serialize(ref calldata);

        let (contract_address, _) = class.deploy(@calldata).unwrap();

        IERC20Dispatcher { contract_address }
    }

    fn request_fixture_custom_classes(
        erc20_class: ContractClass, account_class: ContractClass
    ) -> (
        SocialRequest<Transfer>,
        ISocialAccountDispatcher,
        ISocialAccountDispatcher,
        IERC20Dispatcher
    ) {
        // sender private key: 70aca2a9ab722bd56a9a1aadae7f39bc747c7d6735a04d677e0bc5dbefa71d47
        // just for testing, do not use for anything else
        let sender_public_key =
            0xd6f1cf53f9f52d876505164103b1e25811ec4226a17c7449576ea48b00578171_u256;

        let sender = deploy_account(account_class, sender_public_key);

        // recipient private key: 59a772c0e643e4e2be5b8bac31b2ab5c5582b03a84444c81d6e2eec34a5e6c35
        // just for testing, do not use for anything else
        let recipient_public_key =
            0x5b2b830f2778075ab3befb5a48c9d8138aef017fab2b26b5c31a2742a901afcc_u256;
        let recipient = deploy_account(account_class, recipient_public_key);

        let joyboy_public_key = 0x84603b4e300840036ca8cc812befcc8e240c09b73812639d5cdd8ece7d6eba40;

        let erc20 = deploy_erc20(erc20_class, 'USDC token', 'USDC', 100, sender.contract_address);

        let transfer = Transfer {
            amount: 1,
            token: erc20.symbol(),
            token_address: erc20.contract_address,
            joyboy: NostrProfile {
                public_key: joyboy_public_key, relays: array!["wss://relay.joyboy.community.com"]
            },
            recipient: NostrProfile { public_key: recipient_public_key, relays: array![] },
            recipient_address: recipient.contract_address
        };

        // for test data see: https://replit.com/@maciejka/WanIndolentKilobyte-2

        let request = SocialRequest {
            public_key: sender_public_key,
            created_at: 1716285235_u64,
            kind: 1_u16,
            tags: "[]",
            content: transfer,
            sig: Signature {
                r: 0x3570a9a0c92c180bd4ac826c887e63844b043e3b65da71a857d2aa29e7cd3a4e_u256,
                s: 0x1c0c0a8b7a8330b6b8915985c9cd498a407587213c2e7608e7479b4ef966605f_u256,
            }
        };

        (request, sender, recipient, erc20)
    }

    fn request_fixture() -> (
        SocialRequest<Transfer>,
        ISocialAccountDispatcher,
        ISocialAccountDispatcher,
        IERC20Dispatcher
    ) {
        let erc20_class = declare_erc20();
        let account_class = declare_account();
        request_fixture_custom_classes(erc20_class, account_class)
    }

    #[test]
    fn get_public_key() {
        let public_key: u256 = 45;
        let account = deploy_account(declare_account(), public_key);
        assert!(account.get_public_key() == public_key, "wrong public_key");
    }

    #[test]
    fn successful_transfer() {
        let (request, sender, _, _) = request_fixture();
        sender.handle_transfer(request);
    }

    #[test]
    #[should_panic(expected: "can't verify signature")]
    fn incorrect_signature() {
        let (request, sender, _, _) = request_fixture();

        let request = SocialRequest {
            sig: Signature {
                r: 0x2570a9a0c92c180bd4ac826c887e63844b043e3b65da71a857d2aa29e7cd3a4e_u256,
                s: 0x1c0c0a8b7a8330b6b8915985c9cd498a407587213c2e7608e7479b4ef966605f_u256,
            },
            ..request,
        };

        sender.handle_transfer(request);
    }

    #[test]
    #[should_panic(expected: "wrong sender")]
    fn wrong_sender() {
        let (request, sender, _, _) = request_fixture();

        let request = SocialRequest { public_key: 123_u256, ..request, };

        sender.handle_transfer(request);
    }

    #[test]
    #[should_panic(expected: "wrong recipient")]
    fn wrong_recipient() {
        let (request, sender, _, _) = request_fixture();

        // let content = request.content.clone();

        let request = SocialRequest {
            content: Transfer {
                recipient_address: sender.contract_address, ..request.content.clone()
            },
            ..request,
        };

        sender.handle_transfer(request);
    }

    #[test]
    #[should_panic(expected: "wrong token")]
    fn wrong_token() {
        let erc20_class = declare_erc20();
        let account_class = declare_account();

        let dai = deploy_erc20(erc20_class, 'DAI token', 'DAI', 100, 21.try_into().unwrap());

        let (request, sender, _, _) = request_fixture_custom_classes(erc20_class, account_class);

        let request = SocialRequest {
            content: Transfer { token_address: dai.contract_address, ..request.content.clone() },
            ..request,
        };

        sender.handle_transfer(request);
    }

    #[test]
    #[should_panic(expected: "double spend")]
    fn double_transfer() {
        let erc20_class = declare_erc20();
        let account_class = declare_account();
        let (request, sender, _, _) = request_fixture_custom_classes(erc20_class, account_class);
        let (request2, _, _, _) = request_fixture_custom_classes(erc20_class, account_class);

        sender.handle_transfer(request);
        sender.handle_transfer(request2);
    }

    #[test]
    fn is_valid_signature() {
        let public_key = 0xdff1d77f2a671c5f36183726db2341be58feae1da2deced843240f7b502ba659;

        let account_class = declare_account();
        let account = deploy_account(account_class, public_key);

        let account = ISRC6Dispatcher { contract_address: account.contract_address };

        let hash = 0x6a8885a308d313198a2e03707344a4093822299f31d0082efa98ec4e6c89;

        let r: u256 = 0x49ae3fa614e2877877a90987726f1b48387bef1f66de78e5075659040cbbf612;
        let s: u256 = 0x11259ae25e0743ac7490df3fef875ea291c7b99cf2295e44aabd677107b9c53a;

        let mut signature = Default::default();
        r.serialize(ref signature);
        s.serialize(ref signature);

        assert!(account.is_valid_signature(hash, signature.clone()) == starknet::VALIDATED);

        let invalid_hash = 0x5a8885a308d313198a2e03707344a4093822299f31d0082efa98ec4e6c89;

        assert!(account.is_valid_signature(invalid_hash, signature) != starknet::VALIDATED);
    }

    #[test]
    fn validate_transaction() {
        let public_key = 0xdff1d77f2a671c5f36183726db2341be58feae1da2deced843240f7b502ba659;

        let account_class = declare_account();
        let account = deploy_account(account_class, public_key);

        let account = ISRC6Dispatcher { contract_address: account.contract_address };

        let hash = 0x6a8885a308d313198a2e03707344a4093822299f31d0082efa98ec4e6c89;

        let r: u256 = 0x49ae3fa614e2877877a90987726f1b48387bef1f66de78e5075659040cbbf612;
        let s: u256 = 0x11259ae25e0743ac7490df3fef875ea291c7b99cf2295e44aabd677107b9c53a;

        let mut signature = Default::default();
        r.serialize(ref signature);
        s.serialize(ref signature);

        cheat_transaction_hash_global(hash);
        cheat_signature_global(signature.span());

        assert!(account.__validate__(Default::default()) == starknet::VALIDATED);

        let invalid_hash = 0x5a8885a308d313198a2e03707344a4093822299f31d0082efa98ec4e6c89;
        cheat_transaction_hash_global(invalid_hash);

        assert!(account.__validate__(Default::default()) != starknet::VALIDATED);

        stop_cheat_transaction_hash_global();
        stop_cheat_signature_global();
    }
}

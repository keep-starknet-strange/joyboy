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
    use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
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
            assert!(request.public_key == self.public_key.read(), "wrong public_key");

            let erc20 = ERC20ABIDispatcher { contract_address: request.content.token_address };
            assert!(erc20.symbol() == request.content.token, "wrong token symbol");

            let recipient = ISocialAccountDispatcher {
                contract_address: request.content.recipient_address
            };

            assert!(
                recipient.get_public_key() == request.content.recipient.public_key,
                "wrong public_key"
            );

            assert!(request.verify());

            // check uniqueness

            erc20.transfer(request.content.recipient_address, request.content.amount);
        }
    }
}

#[cfg(test)]
mod tests {
    use core::traits::Into;
    use openzeppelin::presets::ERC20Upgradeable;
    use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
    use openzeppelin::utils::serde::SerializedAppend;
    use snforge_std::{
        declare, ContractClass, ContractClassTrait, spy_events, SpyOn, EventSpy, EventFetcher,
        Event, EventAssertions
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

    fn declare_account() -> ContractClass {
        declare("SocialAccount").unwrap()
    }

    fn declare_erc20() -> ContractClass {
        declare("ERC20Upgradeable").unwrap()
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
        assert(event.keys.at(0) == @selector!("AccountCreated"), 'Wrong event name');

        let event_key = u256 {
            low: (*event.keys.at(1)).try_into().unwrap(),
            high: (*event.keys.at(2)).try_into().unwrap()
        };

        assert(event_key == public_key, 'Wrong Public Key');

        ISocialAccountDispatcher { contract_address }
    }

    fn deploy_erc20(
        class: ContractClass,
        name: ByteArray,
        symbol: ByteArray,
        initial_supply: u256,
        recipient: ContractAddress
    ) -> ERC20ABIDispatcher {
        let mut calldata = array![];

        name.serialize(ref calldata);

        // calldata.append_serde(name);
        calldata.append_serde(symbol);
        calldata.append_serde(2 * initial_supply);
        calldata.append_serde(recipient);
        calldata.append_serde(recipient);

        let (contract_address, _) = class.deploy(@calldata).unwrap();

        ERC20ABIDispatcher { contract_address }
    }

    #[test]
    fn get_public_key() {
        let public_key: u256 = 45;
        let account = deploy_account(declare_account(), public_key);
        assert!(account.get_public_key() == public_key, "wrong public_key");
    }

    #[test]
    fn handle_transfer() {
        // sender private key: 70aca2a9ab722bd56a9a1aadae7f39bc747c7d6735a04d677e0bc5dbefa71d47
        // just for testing, do not use for anything else
        let sender_public_key =
            0xd6f1cf53f9f52d876505164103b1e25811ec4226a17c7449576ea48b00578171_u256;

        let account_class = declare_account();

        let sender = deploy_account(account_class, sender_public_key);

        // recipient private key: 59a772c0e643e4e2be5b8bac31b2ab5c5582b03a84444c81d6e2eec34a5e6c35
        // just for testing, do not use for anything else
        let recipient_public_key =
            0x5b2b830f2778075ab3befb5a48c9d8138aef017fab2b26b5c31a2742a901afcc_u256;
        let recipient = deploy_account(account_class, recipient_public_key);

        let erc20 = deploy_erc20(
            declare_erc20(), "USDC token", "USDC", 100, sender.contract_address
        );

        let transfer = Transfer {
            amount: 1,
            token: erc20.symbol(),
            token_address: erc20.contract_address,
            joyboy: NostrProfile {
                public_key: 0x84603b4e300840036ca8cc812befcc8e240c09b73812639d5cdd8ece7d6eba40,
                relays: array!["wss://relay.joyboy.community.com"]
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

        sender.handle_transfer(request);
    }
}

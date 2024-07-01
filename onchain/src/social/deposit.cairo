use core::fmt::{Display, Formatter, Error};
use core::to_byte_array::FormatAsByteArray;
use core::traits::Into;
use starknet::{get_caller_address, get_contract_address, get_tx_info, ContractAddress};
use super::request::{SocialRequest, SocialRequestImpl, SocialRequestTrait, Encode, Signature};

pub type DepositId = felt252;

#[derive(Clone, Debug, Drop, Serde)]
pub struct Claim {
    pub deposit_id: DepositId,
    pub starknet_recipient: ContractAddress,
    pub gas_token_address: ContractAddress,
    pub gas_amount: u256,
}

impl ClaimEncodeImpl of Encode<Claim> {
    fn encode(self: @Claim) -> @ByteArray {
        let recipient_address: felt252 = (*self.starknet_recipient).into();
        let gas_token_address: felt252 = (*self.gas_token_address).into();
        @format!(
            "claim: {},{},{},{}",
            self.deposit_id,
            recipient_address,
            gas_token_address,
            *self.gas_amount
        )
    }
}

type NostrPublicKey = u256;

#[derive(Copy, Debug, Drop, Serde)]
pub enum DepositResult {
    Transfer: ContractAddress,
    Deposit: DepositId
}

#[derive(Copy, Debug, Drop, PartialEq, starknet::Store, Serde)]
struct Deposit {
    sender: ContractAddress,
    amount: u256,
    token_address: ContractAddress,
    recipient: NostrPublicKey,
    ttl: u64,
}

#[starknet::interface]
pub trait IDepositEscrow<TContractState> {
    fn get_deposit(self: @TContractState, deposit_id: DepositId) -> Deposit;
    fn deposit(
        ref self: TContractState,
        amount: u256,
        token_address: ContractAddress,
        nostr_recipient: NostrPublicKey,
        timelock: u64
    ) -> DepositResult;
    fn cancel(ref self: TContractState, deposit_id: DepositId);
    fn claim(ref self: TContractState, request: SocialRequest<Claim>, gas_amount: u256);
}

#[starknet::contract]
pub mod DepositEscrow {
    use core::num::traits::Zero;
    use joyboy::bip340;
    use joyboy::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::account::Call;
    use starknet::{
        get_block_timestamp, get_caller_address, get_contract_address, get_tx_info, ContractAddress
    };
    use super::super::request::{
        SocialRequest, SocialRequestImpl, SocialRequestTrait, Encode, Signature
    };

    use super::{Deposit, DepositId, DepositResult, IDepositEscrow, NostrPublicKey, Claim};

    impl DepositDefault of Default<Deposit> {
        #[inline(always)]
        fn default() -> Deposit {
            Deposit {
                sender: 0.try_into().unwrap(),
                amount: 0.into(),
                token_address: 0.try_into().unwrap(),
                recipient: 0_u256,
                ttl: 0_u64
            }
        }
    }

    #[storage]
    struct Storage {
        next_deposit_id: DepositId,
        deposits: LegacyMap<DepositId, Deposit>,
        nostr_to_sn: LegacyMap<NostrPublicKey, ContractAddress>
    }

    #[derive(Drop, starknet::Event)]
    struct ClaimEvent {
        #[key]
        deposit_id: DepositId,
        #[key]
        sender: ContractAddress,
        #[key]
        nostr_recipient: NostrPublicKey,
        #[key]
        starknet_recipient: ContractAddress,
        amount: u256,
        token_address: ContractAddress,
        gas_token_address: ContractAddress,
        gas_amount: u256
    }

    #[derive(Drop, starknet::Event)]
    struct DepositEvent {
        #[key]
        deposit_id: DepositId,
        #[key]
        sender: ContractAddress,
        #[key]
        nostr_recipient: NostrPublicKey,
        amount: u256,
        token_address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct CancelEvent {
        #[key]
        deposit_id: DepositId,
        #[key]
        sender: ContractAddress,
        #[key]
        nostr_recipient: NostrPublicKey,
        amount: u256,
        token_address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct TransferEvent {
        #[key]
        sender: ContractAddress,
        #[key]
        nostr_recipient: NostrPublicKey,
        #[key]
        starknet_recipient: ContractAddress,
        amount: u256,
        token_address: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ClaimEvent: ClaimEvent,
        DepositEvent: DepositEvent,
        CancelEvent: CancelEvent,
        TransferEvent: TransferEvent,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.next_deposit_id.write(1);
    }

    #[abi(embed_v0)]
    impl DepositEscrowImpl of IDepositEscrow<ContractState> {
        fn get_deposit(self: @ContractState, deposit_id: DepositId) -> Deposit {
            self.deposits.read(deposit_id)
        }

        fn deposit(
            ref self: ContractState,
            amount: u256,
            token_address: ContractAddress,
            nostr_recipient: NostrPublicKey,
            timelock: u64
        ) -> DepositResult {
            let recipient = self.nostr_to_sn.read(nostr_recipient);

            if (!recipient.is_zero()) {
                let erc20 = IERC20Dispatcher { contract_address: token_address };
                erc20.transfer_from(get_caller_address(), recipient, amount);
                self
                    .emit(
                        TransferEvent {
                            sender: get_caller_address(),
                            nostr_recipient,
                            starknet_recipient: recipient,
                            amount: amount,
                            token_address: token_address
                        }
                    );
                return DepositResult::Transfer(recipient);
            }

            let deposit_id = self.next_deposit_id.read();
            self.next_deposit_id.write(deposit_id + 1);

            let erc20 = IERC20Dispatcher { contract_address: token_address };
            erc20.transfer_from(get_caller_address(), get_contract_address(), amount);

            self
                .deposits
                .write(
                    deposit_id,
                    Deposit {
                        sender: get_caller_address(),
                        amount,
                        token_address,
                        recipient: nostr_recipient,
                        ttl: get_block_timestamp() + timelock
                    }
                );
            self
                .emit(
                    DepositEvent {
                        deposit_id,
                        sender: get_caller_address(),
                        nostr_recipient,
                        amount: amount,
                        token_address: token_address
                    }
                );

            DepositResult::Deposit(deposit_id)
        }

        fn cancel(ref self: ContractState, deposit_id: DepositId) {
            let deposit = self.deposits.read(deposit_id);
            assert!(deposit != Default::default(), "can't find deposit");
            assert!(deposit.sender == get_caller_address(), "not authorized");
            assert!(
                deposit.ttl <= get_block_timestamp(), "can't cancel before timelock expiration"
            );

            let erc20 = IERC20Dispatcher { contract_address: deposit.token_address };

            erc20.transfer(get_caller_address(), deposit.amount);
            self.deposits.write(deposit_id, Default::default());
            self
                .emit(
                    CancelEvent {
                        deposit_id,
                        sender: get_caller_address(),
                        nostr_recipient: deposit.recipient,
                        amount: deposit.amount,
                        token_address: deposit.token_address
                    }
                );
        }

        fn claim(ref self: ContractState, request: SocialRequest<Claim>, gas_amount: u256) {
            let claim = @request.content;

            let deposit = self.deposits.read(*claim.deposit_id);
            assert!(deposit != Default::default(), "can't find deposit");
            assert!(request.public_key == deposit.recipient, "invalid recipient");
            request.verify().expect('can\'t verify signature');

            let erc20 = IERC20Dispatcher { contract_address: deposit.token_address };
            erc20.transfer(*claim.starknet_recipient, deposit.amount - gas_amount);

            self.nostr_to_sn.write(request.public_key, *claim.starknet_recipient);
            self.deposits.write(*claim.deposit_id, Default::default());

            // TODO: swap if necessary
            assert!(deposit.token_address == *claim.gas_token_address, "invalid gas_token");
            assert!(gas_amount <= *claim.gas_amount, "gas_amount to big");
            let gas_token = IERC20Dispatcher { contract_address: *claim.gas_token_address };
            gas_token.transfer(get_caller_address(), gas_amount);

            self
                .emit(
                    ClaimEvent {
                        deposit_id: *claim.deposit_id,
                        sender: get_caller_address(),
                        nostr_recipient: request.public_key,
                        amount: deposit.amount,
                        starknet_recipient: *claim.starknet_recipient,
                        token_address: deposit.token_address,
                        gas_token_address: *claim.gas_token_address,
                        gas_amount: *claim.gas_amount
                    }
                );
        }
    }
}

#[cfg(test)]
mod tests {
    use core::array::SpanTrait;
    use core::option::OptionTrait;
    use core::traits::Into;

    use joyboy::erc20::{ERC20, IERC20Dispatcher, IERC20DispatcherTrait};
    use snforge_std::{
        declare, ContractClass, ContractClassTrait, spy_events, SpyOn, EventSpy, EventFetcher,
        Event, EventAssertions, start_cheat_caller_address, cheat_caller_address_global,
        stop_cheat_caller_address_global, start_cheat_block_timestamp,
    };
    use starknet::{
        ContractAddress, get_block_timestamp, get_caller_address, get_contract_address,
        contract_address_const,
    };

    use super::super::request::{SocialRequest, Signature, Encode};
    use super::super::transfer::Transfer;
    use super::{Deposit, DepositId, DepositResult, IDepositEscrow, NostrPublicKey, Claim};
    use super::{IDepositEscrowDispatcher, IDepositEscrowDispatcherTrait};

    fn declare_escrow() -> ContractClass {
        declare("DepositEscrow").unwrap()
    }

    fn declare_erc20() -> ContractClass {
        declare("ERC20").unwrap()
    }

    fn deploy_escrow(class: ContractClass) -> IDepositEscrowDispatcher {
        let mut calldata = array![];

        let (contract_address, _) = class.deploy(@calldata).unwrap();

        IDepositEscrowDispatcher { contract_address }
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
        erc20_class: ContractClass, escrow_class: ContractClass
    ) -> (
        SocialRequest<Claim>,
        NostrPublicKey,
        ContractAddress,
        IERC20Dispatcher,
        IDepositEscrowDispatcher,
    ) {
        // recipient private key: 59a772c0e643e4e2be5b8bac31b2ab5c5582b03a84444c81d6e2eec34a5e6c35
        // just for testing, do not use for anything else
        let recipient_public_key =
            0x5b2b830f2778075ab3befb5a48c9d8138aef017fab2b26b5c31a2742a901afcc_u256;

        let sender_address: ContractAddress = 123.try_into().unwrap();

        let erc20 = deploy_erc20(erc20_class, 'USDC token', 'USDC', 100, sender_address);

        let escrow = deploy_escrow(escrow_class);

        let recipient_address: ContractAddress = 678.try_into().unwrap();

        // for test data see claim to: https://replit.com/@msghais135/WanIndolentKilobyte-claimto#index.js
        let claim = Claim {
            deposit_id: 1,
            starknet_recipient: recipient_address,
            gas_amount: 0,
            gas_token_address: erc20.contract_address
        };

        let request = SocialRequest {
            public_key: recipient_public_key,
            created_at: 1716285235_u64,
            kind: 1_u16,
            tags: "[]",
            content: claim,
            sig: Signature {
                r: 0xf1dac3f8d0d19767805ca85933bdf0e744594aeee04058eedaa29e26de087be9_u256,
                s: 0x144c4636083c7d0e3b8186c8c0bc6fa38bd9c6a629ec6e2ce5e437797a6e911c_u256
            }
        };

        (request, recipient_public_key, sender_address, erc20, escrow)
    }

    fn request_fixture() -> (
        SocialRequest<Claim>,
        NostrPublicKey,
        ContractAddress,
        IERC20Dispatcher,
        IDepositEscrowDispatcher,
    ) {
        let erc20_class = declare_erc20();
        let escrow_class = declare_escrow();
        request_fixture_custom_classes(erc20_class, escrow_class)
    }

    #[test]
    fn deposit_claim() {
        let (request, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();
        let recipient_address: ContractAddress = 678.try_into().unwrap();
        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        let sender_balance_before_deposit = erc20.balance_of(sender_address);

        // Deposit by sender to recipient

        escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 0_u64);

        let sender_balance_after_deposit = erc20.balance_of(sender_address);

        start_cheat_caller_address(escrow.contract_address, recipient_address);
        let escrow_balance_before_claim = erc20.balance_of(escrow.contract_address);

        // Recipient user claim deposit
        let recipient_balance_before_claim = erc20.balance_of(recipient_address);
        escrow.claim(request, 0_u256);

        // Sender check
        assert!(
            sender_balance_before_deposit - amount == sender_balance_after_deposit,
            "sender amount to deposit not send"
        );

        // Recipient check

        let recipient_balance_after_claim = erc20.balance_of(recipient_address);
        assert!(recipient_balance_before_claim == 0, "recipient balance before claim != 0");
        assert!(recipient_balance_after_claim == amount, "recipient balance after claim != 0");

        // Escrow balance 
        assert!(escrow_balance_before_claim == amount, "escrow before claim != amount");
        let escrow_balance_after_claim = erc20.balance_of(escrow.contract_address);
        assert!(escrow_balance_after_claim == 0, "escrow balance after claim != 0");
    }

    #[test]
    fn deposit_claim_gas_fee() {
        let (request, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();

        let recipient_address: ContractAddress = 678.try_into().unwrap();
        let joyboy_address: ContractAddress = 159.try_into().unwrap();
        let amount = 100_u256;
        let gas_amount = 1_u256;

        let claim_gas_amount = Claim {
            deposit_id: 1,
            starknet_recipient: recipient_address,
            gas_amount: gas_amount,
            gas_token_address: erc20.contract_address
        };

        let request_gas_amount = SocialRequest {
            content: claim_gas_amount,
            sig: Signature {
                r: 0x68e441c1f8756b5278c815cc110efb302c2a08bcf0349328ba7bd7683e8b0b29_u256,
                s: 0xd592a5a5e9fc85334ab6801d6dde984c85d67fcd726fce38b9fb06874c25832e_u256
            },
            ..request
        };

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        let sender_balance_before_deposit = erc20.balance_of(sender_address);

        escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 0_u64);

        let sender_balance_after_deposit = erc20.balance_of(sender_address);

        start_cheat_caller_address(escrow.contract_address, joyboy_address);

        let joyboy_balance_before_claim = erc20.balance_of(joyboy_address);

        // Sender check
        assert!(
            sender_balance_before_deposit - amount == sender_balance_after_deposit,
            "sender deposit amount not send"
        );

        // Joyboy account claim user for recipient with gas fees paid by the claim deposit
        let escrow_balance_before_claim = erc20.balance_of(escrow.contract_address);
        let recipient_balance_before_claim = erc20.balance_of(recipient_address);
        escrow.claim(request_gas_amount, gas_amount);

        // Recipient check
        let recipient_balance_after_claim = erc20.balance_of(recipient_address);
        assert!(recipient_balance_before_claim == 0, "recipient balance before claim != 0");
        assert!(
            recipient_balance_after_claim == amount - gas_amount,
            "recipient after claim != (amount - gas)"
        );

        // Check gas amount receive by Joyboy account
        let joyboy_balance_after_claim = erc20.balance_of(joyboy_address);
        assert!(joyboy_balance_before_claim == 0, "joy balance before claim != 0");
        assert!(
            joyboy_balance_after_claim == gas_amount, "joyboy balance not equal gas amount received"
        );

        // Escrow balance
        assert!(escrow_balance_before_claim == amount, "escrow before claim != amount deposit");
        let escrow_balance_after_claim = erc20.balance_of(escrow.contract_address);
        assert!(escrow_balance_after_claim == 0, "escrow balance after claim != 0");
    }

    #[test]
    #[should_panic(expected: "gas_amount to big")]
    fn claim_incorrect_gas_amount() {
        let (request, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();

        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 10_u64);

        escrow.claim(request, 1_u256);
    }

    #[test]
    #[should_panic(expected: 'can\'t verify signature')]
    fn claim_incorrect_signature_claim_to() {
        let (request, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();
        let recipient_address: ContractAddress = 678.try_into().unwrap();

        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 0_u64);

        start_cheat_caller_address(escrow.contract_address, recipient_address);

        let request = SocialRequest {
            sig: Signature {
                r: 0x2570a9a0c92c180bd4ac826c887e63844b043e3b65da71a857d2aa29e7cd3a4e_u256,
                s: 0x1c0c0a8b7a8330b6b8915985c9cd498a407587213c2e7608e7479b4ef966605f_u256,
            },
            ..request,
        };
        escrow.claim(request, 0_u256);
    }


    #[test]
    #[should_panic(expected: 'can\'t verify signature')]
    fn claim_incorrect_signature_claim_to_incorrect_recipient() {
        let (request, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();

        let recipient_address: ContractAddress = 789.try_into().unwrap();
        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 0_u64);

        start_cheat_caller_address(escrow.contract_address, recipient_address);

        let request = SocialRequest {
            sig: Signature {
                r: 0x2570a9a0c92c180bd4ac826c887e63844b043e3b65da71a857d2aa29e7cd3a4e_u256,
                s: 0x1c0c0a8b7a8330b6b8915985c9cd498a407587213c2e7608e7479b4ef966605f_u256,
            },
            ..request,
        };
        escrow.claim(request, 0_u256);
    }

    #[test]
    fn deposit_cancel_no_timelock() {
        let (_, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();

        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        let result = escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 0_u64);

        if let DepositResult::Deposit(deposit_id) = result {
            assert!(deposit_id == 1, "wrong deposit_id");
            escrow.cancel(deposit_id);
        } else {
            assert!(false, "wrong deposit result");
        }
    }

    #[test]
    #[should_panic(expected: "can't cancel before timelock expiration")]
    fn deposit_cancel_before_timelock() {
        let (_, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();

        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        let result = escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 10_u64);

        if let DepositResult::Deposit(deposit_id) = result {
            assert!(deposit_id == 1, "wrong deposit_id");
            escrow.cancel(deposit_id);
        }
    }

    #[test]
    fn deposit_cancel_timelock() {
        let (_, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();

        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        let result = escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 10_u64);

        if let DepositResult::Deposit(deposit_id) = result {
            assert!(deposit_id == 1, "wrong deposit_id");
            start_cheat_block_timestamp(escrow.contract_address, get_block_timestamp() + 10_u64);
            escrow.cancel(deposit_id);
        } else {
            assert!(false, "wrong deposit result");
        }
    }

    #[test]
    #[should_panic(expected: "not authorized")]
    fn not_authorized_cancel() {
        let (_, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();

        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        let result = escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 0_u64);

        if let DepositResult::Deposit(deposit_id) = result {
            let not_sender: ContractAddress = 345.try_into().unwrap();
            start_cheat_caller_address(escrow.contract_address, not_sender);
            escrow.cancel(deposit_id);
        }
    }

    fn deposit_claim_deposit() {
        let (request, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();
        let recipient_address: ContractAddress = 345.try_into().unwrap();
        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        let result = escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 0_u64);

        if let DepositResult::Deposit(deposit_id) = result {
            assert!(deposit_id == 1, "wrong deposit_id");
        } else {
            assert!(false, "wrong first deposit result");
        }

        start_cheat_caller_address(escrow.contract_address, recipient_address);
        escrow.claim(request, 0_u256);

        start_cheat_caller_address(escrow.contract_address, sender_address);
        let result = escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 0_u64);

        if let DepositResult::Transfer(recipient) = result {
            assert!(recipient == recipient_address, "wrong recipient address");
        } else {
            assert!(false, "wrong second deposit result");
        }
    }
}

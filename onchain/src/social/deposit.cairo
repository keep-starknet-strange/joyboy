use starknet::{get_caller_address, get_contract_address, get_tx_info, ContractAddress};
use super::request::{SocialRequest, SocialRequestImpl, SocialRequestTrait, Encode, Signature};

pub type DepositId = felt252;

impl DepositIdEncodeImpl of Encode<DepositId> {
    fn encode(self: @DepositId) -> @ByteArray {
        @format!("claim {}", self)
    }
}

type NostrPublicKey = u256;

#[derive(Copy, Debug, Drop, Serde)]
pub enum DepositResult {
    Transfer: ContractAddress,
    Deposit: DepositId,
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
    fn claim(ref self: TContractState, request: SocialRequest<DepositId>);
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

    use super::{
        Deposit, DepositId, DepositResult, IDepositEscrow, NostrPublicKey, DepositIdEncodeImpl,
    };

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

        fn claim(ref self: ContractState, request: SocialRequest<DepositId>) {
            let deposit_id = request.content;
            let deposit = self.deposits.read(deposit_id);
            assert!(deposit != Default::default(), "can't find deposit");
            assert!(request.public_key == deposit.recipient, "invalid recipient");
            request.verify().expect('can\'t verify signature');

            let erc20 = IERC20Dispatcher { contract_address: deposit.token_address };
            erc20.transfer(get_caller_address(), deposit.amount);

            self.nostr_to_sn.write(request.public_key, get_caller_address());
            self.deposits.write(deposit_id, Default::default());
            self
                .emit(
                    ClaimEvent {
                        deposit_id,
                        sender: get_caller_address(),
                        nostr_recipient: request.public_key,
                        amount: deposit.amount,
                        starknet_recipient: get_caller_address(),
                        token_address: deposit.token_address
                    }
                );
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
        Event, EventAssertions, start_cheat_caller_address, cheat_caller_address_global,
        stop_cheat_caller_address_global, start_cheat_block_timestamp
    };
    use starknet::{
        ContractAddress, get_block_timestamp, get_caller_address, get_contract_address,
        contract_address_const
    };

    use super::super::request::{SocialRequest, Signature, Encode};
    use super::super::transfer::Transfer;
    use super::{Deposit, DepositId, DepositResult, IDepositEscrow, NostrPublicKey};
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
        SocialRequest<DepositId>,
        NostrPublicKey,
        ContractAddress,
        IERC20Dispatcher,
        IDepositEscrowDispatcher
    ) {
        // recipient private key: 59a772c0e643e4e2be5b8bac31b2ab5c5582b03a84444c81d6e2eec34a5e6c35
        // just for testing, do not use for anything else
        let recipient_public_key =
            0x5b2b830f2778075ab3befb5a48c9d8138aef017fab2b26b5c31a2742a901afcc_u256;

        let sender_address: ContractAddress = 123.try_into().unwrap();

        let erc20 = deploy_erc20(erc20_class, 'USDC token', 'USDC', 100, sender_address);

        let escrow = deploy_escrow(escrow_class);

        // for test data see: https://replit.com/@maciejka/WanIndolentKilobyte-2

        let request = SocialRequest {
            public_key: recipient_public_key,
            created_at: 1716285235_u64,
            kind: 1_u16,
            tags: "[]",
            content: 1,
            sig: Signature {
                r: 0x907f347d751aa7866221b29efe316b362e5f7fbc5f8c9adf9cf137ee70a56b63_u256,
                s: 0xe3212c02316ab9bc122e05c105acb1eb9e09992a4d23abb2bc2b54af2e8283a7_u256,
            }
        };

        (request, recipient_public_key, sender_address, erc20, escrow)
    }

    fn request_fixture() -> (
        SocialRequest<DepositId>,
        NostrPublicKey,
        ContractAddress,
        IERC20Dispatcher,
        IDepositEscrowDispatcher
    ) {
        let erc20_class = declare_erc20();
        let escrow_class = declare_escrow();
        request_fixture_custom_classes(erc20_class, escrow_class)
    }

    #[test]
    fn deposit_claim() {
        let (request, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();
        let recipient_address: ContractAddress = 345.try_into().unwrap();
        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount + amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 0_u64);

        start_cheat_caller_address(escrow.contract_address, recipient_address);
        escrow.claim(request);
    }

    #[test]
    #[should_panic(expected: 'can\'t verify signature')]
    fn claim_incorrect_signature() {
        let (request, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();
        let recipient_address: ContractAddress = 345.try_into().unwrap();
        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount + amount);
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

        escrow.claim(request);
    }

    #[test]
    fn deposit_cancel_no_timelock() {
        let (_, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();

        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount + amount);
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
        erc20.approve(escrow.contract_address, amount + amount);
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
        erc20.approve(escrow.contract_address, amount + amount);
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
        erc20.approve(escrow.contract_address, amount + amount);
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
        erc20.approve(escrow.contract_address, amount + amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        let result = escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 0_u64);

        if let DepositResult::Deposit(deposit_id) = result {
            assert!(deposit_id == 1, "wrong deposit_id");
        } else {
            assert!(false, "wrong first deposit result");
        }

        start_cheat_caller_address(escrow.contract_address, recipient_address);
        escrow.claim(request);

        start_cheat_caller_address(escrow.contract_address, sender_address);
        let result = escrow.deposit(amount, erc20.contract_address, recipient_nostr_key, 0_u64);

        if let DepositResult::Transfer(recipient) = result {
            assert!(recipient == recipient_address, "wrong recipient address");
        } else {
            assert!(false, "wrong second deposit result");
        }
    }
}

use starknet::{get_caller_address, get_contract_address, get_tx_info, ContractAddress};
use super::request::{SocialRequest, SocialRequestImpl, SocialRequestTrait, Encode, Signature};

pub type DepositId = felt252;

impl DepositIdEncodeImpl of Encode<DepositId> {
    fn encode(self: @DepositId) -> @ByteArray {
        @format!("claim {}", self)
    }
}

type NostrPublicKey = u256;

#[derive(Debug, Drop, PartialEq, starknet::Store)]
pub struct Deposit {
    sender: ContractAddress,
    amount: u256,
    token_address: ContractAddress,
    recipient: NostrPublicKey
}

impl DepositDefault of Default<Deposit> {
    #[inline(always)]
    fn default() -> Deposit {
        Deposit {
            sender: 0.try_into().unwrap(),
            amount: 0.into(),
            token_address: 0.try_into().unwrap(),
            recipient: 0_u256
        }
    }
}

#[starknet::interface]
pub trait IDepositEscrow<TContractState> {
    fn deposit(
        ref self: TContractState,
        amount: u256,
        token_address: ContractAddress,
        recipient: NostrPublicKey
    ) -> DepositId;
    fn cancel(ref self: TContractState, deposit_id: DepositId);
    fn claim(ref self: TContractState, request: SocialRequest<DepositId>);
}

#[starknet::contract]
pub mod DepositEscrow {
    use core::num::traits::Zero;
    use joyboy::bip340;

    use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
    use starknet::account::Call;
    use starknet::{get_caller_address, get_contract_address, get_tx_info, ContractAddress};
    use super::super::request::{
        SocialRequest, SocialRequestImpl, SocialRequestTrait, Encode, Signature
    };

    use super::{Deposit, DepositId, IDepositEscrow, NostrPublicKey, DepositIdEncodeImpl};

    #[storage]
    struct Storage {
        next_deposit_id: DepositId,
        deposits: LegacyMap<DepositId, Deposit>
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.next_deposit_id.write(1);
    }

    #[abi(embed_v0)]
    impl DepositEscrowImpl of IDepositEscrow<ContractState> {
        fn deposit(
            ref self: ContractState,
            amount: u256,
            token_address: ContractAddress,
            recipient: NostrPublicKey
        ) -> DepositId {
            let deposit_id = self.next_deposit_id.read();
            self.next_deposit_id.write(deposit_id + 1);

            let erc20 = ERC20ABIDispatcher { contract_address: token_address };
            erc20.transfer_from(get_caller_address(), get_contract_address(), amount);

            let deposit = Deposit {
                sender: get_caller_address(), amount, token_address, recipient
            };
            self.deposits.write(deposit_id, deposit);

            deposit_id
        }

        fn cancel(ref self: ContractState, deposit_id: DepositId) {
            let deposit = self.deposits.read(deposit_id);
            assert!(deposit != Default::default(), "can't find deposit");

            assert!(deposit.sender == get_caller_address(), "not authorized");

            let erc20 = ERC20ABIDispatcher { contract_address: deposit.token_address };

            erc20.transfer(get_caller_address(), deposit.amount);

            self.deposits.write(deposit_id, Default::default());
        }

        fn claim(ref self: ContractState, request: SocialRequest<DepositId>) {
            let deposit_id = request.content;
            let deposit = self.deposits.read(deposit_id);
            assert!(deposit != Default::default(), "can't find deposit");
            assert!(request.public_key == deposit.recipient, "invalid recipient");
            request.verify().expect('can\'t verify signature');
            
            let erc20 = ERC20ABIDispatcher { contract_address: deposit.token_address };
            erc20.transfer(get_caller_address(), deposit.amount);

            self.deposits.write(deposit_id, Default::default());
        }
    }
}

#[cfg(test)]
mod tests {
    use core::array::SpanTrait;
    use core::traits::Into;

    use openzeppelin::account::interface::{ISRC6Dispatcher, ISRC6DispatcherTrait};
    use openzeppelin::presets::ERC20Upgradeable;
    use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
    use openzeppelin::utils::serde::SerializedAppend;
    use snforge_std::{
        declare, ContractClass, ContractClassTrait, spy_events, SpyOn, EventSpy, EventFetcher,
        Event, EventAssertions, start_cheat_caller_address, cheat_caller_address_global,
        stop_cheat_caller_address_global
    };
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, contract_address_const
    };

    use super::super::request::{SocialRequest, Signature, Encode};
    use super::super::transfer::Transfer;
    use super::{Deposit, DepositId, IDepositEscrow, NostrPublicKey};
    use super::{IDepositEscrowDispatcher, IDepositEscrowDispatcherTrait};

    fn declare_escrow() -> ContractClass {
        declare("DepositEscrow").unwrap()
    }

    fn declare_erc20() -> ContractClass {
        declare("ERC20Upgradeable").unwrap()
    }

    fn deploy_escrow(class: ContractClass) -> IDepositEscrowDispatcher {
        let mut calldata = array![];

        let (contract_address, _) = class.deploy(@calldata).unwrap();

        IDepositEscrowDispatcher { contract_address }
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

    fn request_fixture_custom_classes(
        erc20_class: ContractClass, escrow_class: ContractClass
    ) -> (
        SocialRequest<DepositId>,
        NostrPublicKey,
        ContractAddress,
        ERC20ABIDispatcher,
        IDepositEscrowDispatcher
    ) {
        // recipient private key: 59a772c0e643e4e2be5b8bac31b2ab5c5582b03a84444c81d6e2eec34a5e6c35
        // just for testing, do not use for anything else
        let recipient_public_key =
            0x5b2b830f2778075ab3befb5a48c9d8138aef017fab2b26b5c31a2742a901afcc_u256;

        let sender_address: ContractAddress = 123.try_into().unwrap();

        let erc20 = deploy_erc20(erc20_class, "USDC token", "USDC", 100, sender_address);

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
        ERC20ABIDispatcher,
        IDepositEscrowDispatcher
    ) {
        let erc20_class = declare_erc20();
        let escrow_class = declare_escrow();
        request_fixture_custom_classes(erc20_class, escrow_class)
    }

    #[test]
    fn deposit_claim_flow() {
        let (request, recipient_nostr_key, sender_address, erc20, escrow) = request_fixture();
        let recipient_address: ContractAddress = 345.try_into().unwrap();
        let amount = 100_u256;

        cheat_caller_address_global(sender_address);
        erc20.approve(escrow.contract_address, amount + amount);
        stop_cheat_caller_address_global();

        start_cheat_caller_address(escrow.contract_address, sender_address);
        escrow.deposit(amount, erc20.contract_address, recipient_nostr_key);

        start_cheat_caller_address(escrow.contract_address, recipient_address);
        escrow.claim(request);
    }
}

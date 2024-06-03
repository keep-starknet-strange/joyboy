use super::request::SocialRequest;
use super::transfer::Transfer;

#[starknet::interface]
pub trait ISocial<TState> {
    fn handle_transfer(ref self: TState, request: SocialRequest<Transfer>);
}

#[starknet::component]
pub mod SocialComponent {
    use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
    use super::super::account::{ISocialAccountDispatcher, ISocialAccountDispatcherTrait};
    use super::super::public_key_component::PublicKeyComponent::PublicKey;
    use super::super::public_key_component::PublicKeyComponent;
    use super::super::request::{SocialRequest, SocialRequestImpl};
    use super::super::transfer::Transfer;

    #[storage]
    struct Storage {
        transfers: LegacyMap<u256, bool>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {}

    #[embeddable_as(SocialImpl)]
    pub impl Social<
        TContractState,
        +HasComponent<TContractState>,
        +Drop<TContractState>,
        impl PublicKey: PublicKeyComponent::HasComponent<TContractState>
    > of super::ISocial<ComponentState<TContractState>> {
        fn handle_transfer(
            ref self: ComponentState<TContractState>, request: SocialRequest<Transfer>
        ) {
            let public_key_component = get_dep_component!(@self, PublicKey);
            assert!(
                request.public_key == public_key_component.get_public_key(), "wrong public_key"
            );

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

    #[generate_trait]
    pub impl InternalImpl<
        TContractState, +HasComponent<TContractState>, +Drop<TContractState>
    > of InternalTrait<TContractState> {}
}

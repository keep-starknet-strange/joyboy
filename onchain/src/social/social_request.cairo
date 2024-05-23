use super::transfer::Transfer;
use super::request::SocialRequest;

#[starknet::interface]
pub trait ISocialRequest<TState> {
    fn handle_transfer_request(ref self: TState, request: SocialRequest<Transfer>);
}

#[starknet::component]
pub mod SocialRequestComponent {
    use super::super::transfer::Transfer;
    use super::super::request::SocialRequest;

    #[storage]
    struct Storage { // TODO: empty for now
    }

    #[event]
    #[derive(Drop, PartialEq, starknet::Event)]
    pub enum Event { // TODO: empty for now
    }

    #[embeddable_as(SocialRequestImpl)]
    impl SocialRequestExternal<
        TContractState, +HasComponent<TContractState>, +Drop<TContractState>
    > of super::ISocialRequest<ComponentState<TContractState>> {
        fn handle_transfer_request(
            ref self: ComponentState<TContractState>, request: SocialRequest<Transfer>
        ) {
            // TODO: implement handle transfer logic
            panic!("NOT_IMPLEMENTED");
        }
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState, +HasComponent<TContractState>, +Drop<TContractState>
    > of InternalTrait<TContractState> { // TODO: empty for now
    }
}

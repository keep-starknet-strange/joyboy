#[starknet::interface]
pub trait ISocial<TState> { // TODO: empty for now
}

#[starknet::component]
pub mod SocialComponent {
    use super::super::request::SocialRequest;
    use super::super::transfer::Transfer;

    #[storage]
    struct Storage { // TODO: empty for now
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event { // TODO: empty for now
    }

    #[embeddable_as(SocialImpl)]
    impl Social<
        TContractState, +HasComponent<TContractState>, +Drop<TContractState>
    > of super::ISocial<ComponentState<TContractState>> { // TODO: empty for now
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState, +HasComponent<TContractState>, +Drop<TContractState>
    > of InternalTrait<TContractState> {
        fn handle_transfer(
            ref self: ComponentState<TContractState>, request: SocialRequest<Transfer>
        ) { // TODO: implement handle transfer logic
        }
    }
}

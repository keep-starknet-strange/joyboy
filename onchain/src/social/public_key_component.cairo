#[starknet::interface]
pub trait IPublicKey<TState> {
    fn get_public_key(self: @TState) -> u256;
}

#[starknet::component]
pub mod PublicKeyComponent {
    #[storage]
    struct Storage {
        public_key: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {}

    #[embeddable_as(PublicKeyImpl)]
    pub impl PublicKey<
        TContractState, +HasComponent<TContractState>, +Drop<TContractState>
    > of super::IPublicKey<ComponentState<TContractState>> {
        fn get_public_key(self: @ComponentState<TContractState>) -> u256 {
            self.public_key.read()
        }
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState, +HasComponent<TContractState>, +Drop<TContractState>
    > of InternalTrait<TContractState> {
        fn initializer(ref self: ComponentState<TContractState>, public_key: u256) {
            self.public_key.write(public_key);
        }
    }
}

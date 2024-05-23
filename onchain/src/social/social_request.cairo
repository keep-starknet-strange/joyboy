use super::transfer_request::TransferRequest;

// request types added temporarily for the OD Hack
#[derive(Copy, Drop, Debug, Serde)]
pub struct Signature {
    pub r: u256,
    pub s: u256
}

#[derive(Drop, Serde)]
pub struct SocialRequest {
    pub pubkey: u256,
    pub created_at: u64,
    pub kind: u16,
    pub tags: ByteArray, // we don't need to look inside the tags(at least for now)
    pub content: TransferRequest,
    pub sig: Signature
}

#[starknet::interface]
pub trait ISocialRequest<TState> {
    fn handle_transfer_request(ref self: TState, request: SocialRequest);
}

#[starknet::component]
pub mod SocialRequestComponent {
    use super::SocialRequest;

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
            ref self: ComponentState<TContractState>, request: SocialRequest
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

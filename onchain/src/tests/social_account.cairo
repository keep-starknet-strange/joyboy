use joyboy::social_account::interfaces::{
    ISocialPayAccountDispatcher, ISocialPayAccountDispatcherTrait
};
use joyboy::social_account::social_account::SocialPayAccount::SocialAccountInitParams;
use snforge_std as snf;


const public_key: u256 = "0x69bb4cbcc59b557ed7a782a3c267be288124a4ec20be3d8648ac44475a7c53e";

fn deploy_social_account() -> ContractAddress {
    let contract = declare("SocialPayAccount");

    let mut social_account_calldata = array![];

    SocialAccountInitParams { public_key: public_key }.serialize(ref social_account_calldata);

    contract.deploy(@social_account_calldata).unwrap()
}


#[test]
fn test_get_public_key() {
    let contract_address = deploy_social_account();
    let dispatcher = ISocialPayAccountDispatcher { contract_address };

    let get_public_key = dispatcher.get_public_key();

    assert!(get_public_key == public_key, "Public key is not the same");
}

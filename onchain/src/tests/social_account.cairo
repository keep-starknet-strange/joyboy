use joyboy::social_account::interfaces::{
    ISocialPayAccountDispatcher, ISocialPayAccountDispatcherTrait
};
use joyboy::social_account::social_account::SocialPayAccount::SocialAccountInitParams;
use starknet::{ContractAddress, get_caller_address, get_contract_address, contract_address_const};
use snforge_std as snf;
use snforge_std::{declare, ContractClassTrait};


const public_key: u256 = 45;

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

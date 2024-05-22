use starknet::{ContractAddress, get_caller_address, get_contract_address, contract_address_const};

#[starknet::interface]
pub trait ISocialPayAccount<TContractState> {
    fn get_public_key(self: @TContractState) -> u256;
}


#[starknet::contract]
pub mod SocialPayAccount {
    #[storage]
    struct Storage {
        #[key]
        public_key: u256
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AccountCreated: AccountCreated,
    }

    #[derive(Drop, starknet::Event)]
    struct AccountCreated {
        #[key]
        public_key: u256
    }

    #[constructor]
    fn constructor(ref self: ContractState, public_key: u256) {
        self.public_key.write(public_key);
        self.emit(AccountCreated { public_key: public_key });
    }

    #[abi(embed_v0)]
    impl SocialPayAccount of super::ISocialPayAccount<ContractState> {
        fn get_public_key(self: @ContractState) -> u256 {
            self.public_key.read()
        }
    }
}

#[cfg(test)]
mod tests {
    use core::traits::Into;
    use core::array::ArrayTrait;
    use core::traits::TryInto;
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, contract_address_const
    };
    use starknet::{SyscallResultTrait, syscalls::deploy_syscall, class_hash::ClassHash};

    use super::SocialPayAccount;
    use super::{
        ISocialPayAccountDispatcher, ISocialPayAccountDispatcherTrait,
        ISocialPayAccountSafeDispatcher, ISocialPayAccountSafeDispatcherTrait
    };


    const public_key: u256 = 45;

    fn deploy_contract() -> ContractAddress {
        let class_hash_value: ClassHash = SocialPayAccount::TEST_CLASS_HASH.try_into().unwrap();

        let mut calldata = ArrayTrait::new();
        calldata.append(public_key.try_into().unwrap());

        let (contract_address, _) = deploy_syscall(class_hash_value, 0, calldata.span(), false)
            .unwrap_syscall();

        contract_address
    }

    #[test]
    #[available_gas(2000000000)]
    fn test_get_public_key() {
        let social_pay_account_contract_address = deploy_contract();

        let social_pay_dispatcher = ISocialPayAccountDispatcher {
            contract_address: social_pay_account_contract_address
        };
        let public_key = social_pay_dispatcher.get_public_key();

        assert!(public_key == 45, "Public key is not the same");
    }
}


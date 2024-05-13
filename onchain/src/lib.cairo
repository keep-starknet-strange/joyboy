mod social_account {
    pub mod interfaces;
    pub mod social_account;

    use interfaces::{
        ISocialPayAccount, ISocialPayAccountDispatcher, ISocialPayAccountDispatcherTrait
    };
    use social_account::SocialPayAccount;
}
pub mod bip340;

#[cfg(test)]
mod tests {
    pub(crate) mod social_account;
}


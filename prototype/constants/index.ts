export const ACCOUNT_TEST_PROFILE = {
  alice: {
    name: "alice.xyz",
    pubkey: "",
    strkKey: "",
    nostrPk:"",
    privateKey:"",
    contract:"0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1"
  },
  bob: {
    name: "joyboy.xyz",
    pubkey: "",
    strkKey: "",
    nostrPk:"",
    privateKey:"",
    contract:"0x0538907b56f07ef4f90e6f2da26a099ccfbc64e1cc4d03ff1e627fa7c2eb78ac"
  },
};
export const ERROR_MESSAGES = {
  EVENT_NOTE_INVALID: {
    label: "EVENT_NOTE_INVALID",
    message: "The note event provided is invalid",
  },
  ADDRESS_INVALID: {
    label: "ADDRESS_INVALID",
    message: "The address of the receiver or sender are invalid",
  },
  PAY_REQUEST_NOT_FOUND: {
    label: "PAY_REQUEST_NOT_FOUND",
    message: "The pay request content on the event note is not correct",
  },
};


export const TOKENS_ADDRESS = {
  SEPOLIA: {
    ETH:"0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    TEST:"0x00148a15f9fbf4c015b927bf88608fbafb6d149abdd5ef5b3e3b296e6ac999a4",
    STRK:"0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
  },
}
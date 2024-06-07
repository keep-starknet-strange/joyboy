export const ACCOUNT_TEST_PROFILE = {
  alice: {
    name: "alice.xyz",
    pubkey: "",
    strkKey: "",
    nostrPk: "",
    nostrPrivateKey: "",
    // contract:"0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
    contract:
      "0x0261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
  },
  bob: {
    name: "joyboy.xyz",
    pubkey: "",
    strkKey: "",
    /** FIRST TEST */
    nostrPk: "7bda974afb863f5b5fb841be3f45442d0b0ac5c6cfea8dd328c51870c56c9082",
    nostrPrivateKey:
      "0x6f9cd1183ead4a04abe45ec4dccf615b7b2fe34d2dcae223dfd12acad50c6b0",
    contract:
      "0x6a9473d2024ca4d2de98895ef53a211c40fe683f38ace6e0e201ccc23455a65",
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
    ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    TEST: "0x00148a15f9fbf4c015b927bf88608fbafb6d149abdd5ef5b3e3b296e6ac999a4",
    STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  },
};

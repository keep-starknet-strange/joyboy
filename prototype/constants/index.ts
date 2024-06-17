export const ACCOUNT_TEST_PROFILE = {
  alice: {
    name: "alice.xyz",
    pubkey: "",
    strkKey: "",
    // nostrPk: "5b2b830f2778075ab3befb5a48c9d8138aef017fab2b26b5c31a2742a901afcc",
    nostrPublicKey:"5b2b830f2778075ab3befb5a48c9d8138aef017fab2b26b5c31a2742a901afcc",
    nostrPrivateKey: "59a772c0e643e4e2be5b8bac31b2ab5c5582b03a84444c81d6e2eec34a5e6c35",
    // contract:"0x261d2434b2583293b7dd2048cb9c0984e262ed0a3eb70a19ed4eac6defef8b1",
    contract:
      "0x65d17b5c8fca3da3c45a4b7a97007331d51860e6843094fa98040b3962b741b",
  },
  bob: {
    name: "joyboy.xyz",
    pubkey: "",
    strkKey: "",
    /** FIRST TEST */
 
    // nostrPrivateKey:"3730616361326139616237323262643536613961316161646165376633396263",
    // nostrPk:"70aca2a9ab722bd56a9a1aadae7f39bc747c7d6735a04d677e0bc5dbefa71d47",
    // contract:
    //   "0x16a0e5bb60649dfd66e8edf0b1eef7f5a196d99d41826c367f2eeea5794db2f",


    /** Last deploy */
      // nostrPrivateKey:"e076036c244a8794f4dc351d36af05c99e7bff876dcf7c2e8015cc99d6ee318c",
      // nostrPk:"043cc0b553450d17f1adcdc3bdeb533892624a8a892d943202add694f52fd4c6",
      // contract:
      //   "0x59e5edd06f305aad0c71da5d1c5ddecdf0cd96766fa69f4d81947a97555165f",


      /*** Dummy data */
      nostrPrivateKey:"70aca2a9ab722bd56a9a1aadae7f39bc747c7d6735a04d677e0bc5dbefa71d47",
      
      nostrPublicKey:"d6f1cf53f9f52d876505164103b1e25811ec4226a17c7449576ea48b00578171",
      // nostrPk:"d6f1cf53f9f52d876505164103b1e25811ec4226a17c7449576ea48b00578171",

      contract:
        "0x1b5f5bee60ce25d6979c5b88cfbb74ad1dae197dba11719b2e06a5efa7e666d",
  },
  escrow:{
    contract:"0x53327953bddcb4ae216b14ea0b84261c6c1ad0af112a29be2dab11cf2e76c48",
    SEPOLIA:"0x53327953bddcb4ae216b14ea0b84261c6c1ad0af112a29be2dab11cf2e76c48"
  }
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
    // TEST: "0x00148a15f9fbf4c015b927bf88608fbafb6d149abdd5ef5b3e3b296e6ac999a4",

    STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    USDC:"0x02f37c3e00e75ee4135b32bb60c37e0599af264076376a618f138d2f9929ac74",
    TEST: "0x00148a15f9fbf4c015b927bf88608fbafb6d149abdd5ef5b3e3b296e6ac999a4",
    BIG_TOKEN: "0x00148a15f9fbf4c015b927bf88608fbafb6d149abdd5ef5b3e3b296e6ac999a4",

  },
  DEVNET: {
    ETH: "0x49D36570D4E46F48E99674BD3FCC84644DDD6B96F7C741B1562B82F9E004DC7",
    TEST: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  },
};

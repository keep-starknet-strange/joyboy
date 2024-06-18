import {
  provider,
} from "../utils/starknet";
import { expect } from "chai";
import { generateKeypair, sendEvent } from "../utils/nostr";
import {
  createSocialAccount,
  createSocialContract,
  prepareAndConnectContract,
} from "../utils/social_account";
import { Account, byteArray, cairo, uint256 } from "starknet";
import { ACCOUNT_TEST_PROFILE, TOKENS_ADDRESS } from "../constants";
import { stringToUint8Array } from "../utils/format";
import dotenv from "dotenv";
import { cancel, claimDeposit, createEscrowAccount, deposit } from "../utils/escrow";
dotenv.config();
/** Testing tips flow:
 * Deploy contract
 * Deposit
 * Claim
 * Cancel
 */
// Sepolia params testing
const currentId = 1
const idToClaim = 1
const idToCancel = 1
let escrow_address = ACCOUNT_TEST_PROFILE.escrow.contract // change default address
let token_used_address = TOKENS_ADDRESS.DEVNET.ETH;

describe("Escrow End to end test", () => {
  it("Deploy Escrow", async function () {
    this.timeout(0); // Disable timeout for this test
    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;
    const account = new Account(provider, accountAddress0, privateKey0, "1");
    let escrow;
    if (process.env.IS_DEPLOY_CONTRACT == "true") {
      let escrowContract = await createEscrowAccount();

      console.log("escrow address", escrowContract?.contract_address)
      escrow = await prepareAndConnectContract(
        escrowContract?.contract_address ?? ACCOUNT_TEST_PROFILE?.escrow?.contract, // uncomment if you recreate a contract
        account
      );
    } else {
      escrow = await prepareAndConnectContract(
        escrow_address ?? ACCOUNT_TEST_PROFILE?.escrow?.contract,
        account
      );
    }
  });

  it("Deposit", async function () {
    this.timeout(0); // Disable timeout for this test
    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;
    const account = new Account(provider, accountAddress0, privateKey0, "1");
    const alicePublicKey = ACCOUNT_TEST_PROFILE?.alice?.nostrPublicKey;

    let escrow;
    if (process.env.IS_DEPLOY_CONTRACT == "true") {
      let escrowContract = await createEscrowAccount();

      escrow = await prepareAndConnectContract(
        escrowContract?.contract_address ?? ACCOUNT_TEST_PROFILE?.escrow?.contract, // uncomment if you recreate a contract
        account
      );
    } else {
      escrow = await prepareAndConnectContract(
        escrow_address ?? ACCOUNT_TEST_PROFILE?.escrow?.contract,
        account
      );
    }

    /** Send a note */
    let amount: number = 1;
    let strkToken = await prepareAndConnectContract(
      token_used_address,
      account
    );

    /** Deposit */
    let nextId = currentId //  await escrow.get_next_deposit_id(); // function need to be made?
    console.log("nextId", nextId)

    let depositCurrentId = await escrow.get_deposit(currentId)
    console.log("depositCurrentId", depositCurrentId)
    console.log("try approve escrow erc20")
    let txApprove = await strkToken.approve(
      escrow?.address,
      cairo.uint256(amount), // change for decimals float => uint256.bnToUint256("0x"+alicePublicKey)
    )

    await account?.waitForTransaction(txApprove?.transaction_hash)
    // Need an approve before
    console.log("deposit amount")

    await deposit({
      escrow,
      amount,
      account,
      tokenAddress: strkToken?.address,
      timelock: 100,
      alicePublicKey: alicePublicKey
    })

    // expect(cairo.uint256(depositCurrentId?.amount)).to.deep.eq(depositParams?.amount)

  });

  it("Claim", async function () {
    this.timeout(0); // Disable timeout for this test
    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;
    const account = new Account(provider, accountAddress0, privateKey0, "1");
    let privateKeyAlice = ACCOUNT_TEST_PROFILE?.alice?.nostrPrivateKey as any;
    const alicePublicKey = ACCOUNT_TEST_PROFILE?.alice?.nostrPublicKey;

    let escrow;
    if (process.env.IS_DEPLOY_CONTRACT == "true") {
      let escrowContract = await createEscrowAccount();
      escrow = await prepareAndConnectContract(
        escrowContract?.contract_address ?? ACCOUNT_TEST_PROFILE?.escrow?.contract, // uncomment if you recreate a contract
        account
      );
    } else {
      escrow = await prepareAndConnectContract(
        escrow_address ?? ACCOUNT_TEST_PROFILE?.escrow?.contract,
        account
      );
    }
    /** Claim */
    let timestamp = 1716285235;
    // let timestamp = new Date().getTime();

    let content = `claim ${cairo.felt(currentId)}`;
    let txClaim = await claimDeposit({
      escrow,
      account,
      depositId: idToClaim,
      content,
      timestamp,
      alicePublicKey,
      privateKey: privateKeyAlice
    })
    console.log("tx claim", txClaim)
  });

  it("Cancel", async function () {
    this.timeout(0); // Disable timeout for this test
    const privateKey0 = process.env.DEV_PK as string;
    const accountAddress0 = process.env.DEV_PUBLIC_KEY as string;
    const account = new Account(provider, accountAddress0, privateKey0, "1");
    const alicePublicKey = ACCOUNT_TEST_PROFILE?.alice?.nostrPublicKey;

    let escrow = await prepareAndConnectContract(
      escrow_address ?? ACCOUNT_TEST_PROFILE?.escrow?.contract,
      account
    );
    /** Deposit */
    let depositToCancel = await escrow.get_deposit(idToCancel)
    console.log("deposit to cancel",depositToCancel)
    await cancel({
      escrow,
      account,
      depositId: idToCancel,
    })

  });
});

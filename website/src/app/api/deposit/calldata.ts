import {verifyEvent} from 'nostr-tools';
import {byteArray, cairo, CallData, uint256, validateAndParseAddress} from 'starknet';

import {ESCROW_ADDRESSES} from '@/constants/contracts';
import {Entrypoint} from '@/constants/misc';
import {provider} from '@/services/provider';
import {ErrorCode} from '@/utils/errors';
import {ClaimSchema} from '@/utils/validation';

export const getClaimCallData = async (data: (typeof ClaimSchema)['_output']) => {
  try {
    if (!verifyEvent(data.event)) {
      throw new Error(ErrorCode.INVALID_EVENT_SIGNATURE);
    }
  } catch {
    throw new Error(ErrorCode.INVALID_EVENT);
  }

  const content = data.event.content.replace('claim: ', '').split(',');
  if (content.length !== 4) {
    throw new Error(ErrorCode.INVALID_EVENT_CONTENT);
  }

  const depositId = cairo.felt(content[0]);
  const recipientAddress = `0x${BigInt(content[1]).toString(16)}`;
  const tokenAddress = `0x${BigInt(content[2]).toString(16)}`;
  const gasAmount = BigInt(content[3]);

  try {
    validateAndParseAddress(recipientAddress);
    validateAndParseAddress(tokenAddress);
  } catch {
    throw new Error(ErrorCode.INVALID_ADDRESS);
  }

  const deposit = await provider.callContract({
    contractAddress: ESCROW_ADDRESSES[await provider.getChainId()],
    entrypoint: Entrypoint.GET_DEPOSIT,
    calldata: [depositId],
  });

  const [sender, amountLow, amountHigh] = deposit;
  const amount = uint256.uint256ToBN({low: amountLow, high: amountHigh});

  if (sender === '0x0') {
    throw new Error(ErrorCode.DEPOSIT_NOT_FOUND);
  }

  if (amount < gasAmount) {
    throw new Error(ErrorCode.INVALID_GAS_AMOUNT);
  }

  const {event} = data;
  const {pubkey: publicKey, sig: signature} = event;

  const signatureR = signature.slice(0, signature.length / 2);
  const signatureS = signature.slice(signature.length / 2);

  const calldata = CallData.compile([
    uint256.bnToUint256(`0x${publicKey}`),
    event.created_at,
    event.kind,
    byteArray.byteArrayFromString(JSON.stringify(event.tags)),
    {
      deposit_id: depositId,
      starknet_recipient: recipientAddress,
      gas_token_address: tokenAddress,
      gas_amount: uint256.bnToUint256(gasAmount),
    },
    {
      r: uint256.bnToUint256(`0x${signatureR}`),
      s: uint256.bnToUint256(`0x${signatureS}`),
    },
    uint256.bnToUint256(gasAmount),
  ]);

  return {calldata, gasAmount};
};

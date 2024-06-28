import express from 'express';
import {verifyEvent} from 'nostr-tools';
import {byteArray, cairo, CallData, uint256, validateAndParseAddress} from 'starknet';

import {ESCROW_ADDRESSES} from '../constants/contracts';
import {Entrypoint} from '../constants/misc';
import {account} from '../services/account';
import {provider} from '../services/provider';
import {ErrorCode} from '../utils/errors';
import {HTTPStatus} from '../utils/http';
import {DepositClaimSchema} from '../utils/validation';

const Router = express.Router();

Router.post('/claim', async (req, res) => {
  const body = DepositClaimSchema.safeParse(req.body);
  if (!body.success) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCode.BAD_REQUEST, error: body.error});
    return;
  }

  if (!verifyEvent(body.data.event)) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCode.INVALID_EVENT_SIGNATURE});
    return;
  }

  const content = body.data.event.content.replace('claim: ', '').split(',');
  if (content.length !== 4) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCode.INVALID_EVENT_CONTENT});
    return;
  }

  const depositId = cairo.felt(content[0]);
  const recipientAddress = `0x${BigInt(content[1]).toString(16)}`;
  const tokenAddress = `0x${BigInt(content[2]).toString(16)}`;
  const gasAmount = BigInt(content[3]);

  try {
    validateAndParseAddress(recipientAddress);
    validateAndParseAddress(tokenAddress);
  } catch {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCode.INVALID_ADDRESS});
    return;
  }

  const deposit = await provider.callContract({
    contractAddress: ESCROW_ADDRESSES[await provider.getChainId()],
    entrypoint: Entrypoint.GET_DEPOSIT,
    calldata: [depositId],
  });

  const [sender, amountLow, amountHigh] = deposit;
  const amount = uint256.uint256ToBN({low: amountLow, high: amountHigh});

  if (sender === '0x0') {
    res.status(HTTPStatus.NotFound).send({code: ErrorCode.DEPOSIT_NOT_FOUND});
    return;
  }

  if (amount > gasAmount) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCode.INVALID_GAS_AMOUNT});
    return;
  }

  const {event} = body.data;
  const {pubkey: publicKey, sig: signature} = event;

  const signatureR = signature.slice(0, signature.length / 2);
  const signatureS = signature.slice(signature.length / 2);

  const claimCallData = CallData.compile([
    uint256.bnToUint256(`0x${publicKey}`),
    event.created_at,
    event.kind,
    byteArray.byteArrayFromString(JSON.stringify(event.tags)),
    event.content,
    {
      r: uint256.bnToUint256(`0x${signatureR}`),
      s: uint256.bnToUint256(`0x${signatureS}`),
    },
    uint256.bnToUint256(gasAmount),
  ]);

  try {
    const result = await account.execute([
      {
        contractAddress: ESCROW_ADDRESSES[await provider.getChainId()],
        entrypoint: Entrypoint.CLAIM,
        calldata: claimCallData,
      },
    ]);

    res.status(HTTPStatus.OK).send(result);
  } catch (error) {
    res.status(HTTPStatus.InternalServerError).send({code: ErrorCode.TRANSACTION_ERROR, error});
    return;
  }
});

export default Router;

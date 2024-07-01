import {NextRequest, NextResponse} from 'next/server';
import {verifyEvent} from 'nostr-tools/pure';
import {byteArray, cairo, CallData, uint256, validateAndParseAddress} from 'starknet';

import {ESCROW_ADDRESSES} from '../../../constants/contracts';
import {Entrypoint} from '../../../constants/misc';
import {account} from '../../../services/account';
import {provider} from '../../../services/provider';
import {ErrorCode} from '../../../utils/errors';
import {HTTPStatus} from '../../../utils/http';
import {ClaimSchema} from '../../../utils/validation';

export async function POST(request: NextRequest) {
  const requestBody = await request.json();

  const body = ClaimSchema.safeParse(requestBody);
  if (!body.success) {
    return NextResponse.json(
      {code: ErrorCode.BAD_REQUEST, error: body.error},
      {status: HTTPStatus.BadRequest},
    );
  }

  if (!verifyEvent(body.data.event)) {
    return NextResponse.json(
      {code: ErrorCode.INVALID_EVENT_SIGNATURE},
      {status: HTTPStatus.BadRequest},
    );
  }

  const content = body.data.event.content.replace('claim: ', '').split(',');
  if (content.length !== 4) {
    return NextResponse.json(
      {code: ErrorCode.INVALID_EVENT_CONTENT},
      {status: HTTPStatus.BadRequest},
    );
  }

  const depositId = cairo.felt(content[0]);
  const recipientAddress = `0x${BigInt(content[1]).toString(16)}`;
  const tokenAddress = `0x${BigInt(content[2]).toString(16)}`;
  const gasAmount = BigInt(content[3]);

  try {
    validateAndParseAddress(recipientAddress);
    validateAndParseAddress(tokenAddress);
  } catch {
    return NextResponse.json({code: ErrorCode.INVALID_ADDRESS}, {status: HTTPStatus.BadRequest});
  }

  const deposit = await provider.callContract({
    contractAddress: ESCROW_ADDRESSES[await provider.getChainId()],
    entrypoint: Entrypoint.GET_DEPOSIT,
    calldata: [depositId],
  });

  const [sender, amountLow, amountHigh] = deposit;
  const amount = uint256.uint256ToBN({low: amountLow, high: amountHigh});

  if (sender === '0x0') {
    return NextResponse.json({code: ErrorCode.DEPOSIT_NOT_FOUND}, {status: HTTPStatus.NotFound});
  }

  if (amount < gasAmount) {
    return NextResponse.json({code: ErrorCode.INVALID_GAS_AMOUNT}, {status: HTTPStatus.BadRequest});
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
    const {transaction_hash} = await account.execute([
      {
        contractAddress: ESCROW_ADDRESSES[await provider.getChainId()],
        entrypoint: Entrypoint.CLAIM,
        calldata: claimCallData,
      },
    ]);

    return NextResponse.json({transaction_hash}, {status: HTTPStatus.OK});
  } catch (error) {
    return NextResponse.json(
      {code: ErrorCode.TRANSACTION_ERROR, error},
      {status: HTTPStatus.InternalServerError},
    );
  }
}

import {NextRequest, NextResponse} from 'next/server';
import {Calldata} from 'starknet';

import {ESCROW_ADDRESSES} from '@/constants/contracts';
import {Entrypoint} from '@/constants/misc';
import {account} from '@/services/account';
import {provider} from '@/services/provider';
import {ErrorCode} from '@/utils/errors';
import {HTTPStatus} from '@/utils/http';
import {ClaimSchema} from '@/utils/validation';

import {getClaimCallData} from '../calldata';

export async function POST(request: NextRequest) {
  const requestBody = await request.json();

  const body = ClaimSchema.safeParse(requestBody);
  if (!body.success) {
    return NextResponse.json(
      {code: ErrorCode.BAD_REQUEST, error: body.error},
      {status: HTTPStatus.BadRequest},
    );
  }

  let claimCallData: Calldata;
  try {
    const {calldata} = await getClaimCallData(body.data);
    claimCallData = calldata;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({code: error.message}, {status: HTTPStatus.BadRequest});
    }

    throw error;
  }

  try {
    const result = await account.estimateInvokeFee([
      {
        contractAddress: ESCROW_ADDRESSES[await provider.getChainId()],
        entrypoint: Entrypoint.CLAIM,
        calldata: claimCallData,
      },
    ]);

    const fee = result.suggestedMaxFee.toString();

    return NextResponse.json({fee}, {status: HTTPStatus.OK});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {code: ErrorCode.ESTIMATION_ERROR, error},
      {status: HTTPStatus.InternalServerError},
    );
  }
}

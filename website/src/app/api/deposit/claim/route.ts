import {fetchBuildExecuteTransaction, fetchQuotes} from '@avnu/avnu-sdk';
import {NextRequest, NextResponse} from 'next/server';
import {Calldata} from 'starknet';

import {ESCROW_ADDRESSES, ETH_ADDRESSES, STRK_ADDRESSES} from '@/constants/contracts';
import {AVNU_URL, CHAIN_ID, Entrypoint} from '@/constants/misc';
import {account} from '@/services/account';
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
  let gasAmount: bigint;
  let gasTokenAddress: string;
  try {
    const result = await getClaimCallData(body.data);
    claimCallData = result.calldata;
    gasAmount = result.gasAmount;
    gasTokenAddress = result.tokenAddress;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({code: error.message}, {status: HTTPStatus.BadRequest});
    }

    throw error;
  }

  try {
    if (
      gasTokenAddress === ETH_ADDRESSES[CHAIN_ID] ||
      gasTokenAddress === STRK_ADDRESSES[CHAIN_ID]
    ) {
      // ETH | STRK transaction

      const {transaction_hash} = await account.execute(
        [
          {
            contractAddress: ESCROW_ADDRESSES[CHAIN_ID],
            entrypoint: Entrypoint.CLAIM,
            calldata: claimCallData,
          },
        ],
        {
          version: gasTokenAddress === ETH_ADDRESSES[CHAIN_ID] ? 1 : 3,
          maxFee: gasAmount,
        },
      );

      return NextResponse.json({transaction_hash}, {status: HTTPStatus.OK});
    } else {
      // ERC20 transaction

      const result = await account.estimateInvokeFee([
        {
          contractAddress: ESCROW_ADDRESSES[CHAIN_ID],
          entrypoint: Entrypoint.CLAIM,
          calldata: claimCallData,
        },
      ]);

      const gasFeeQuotes = await fetchQuotes(
        {
          buyTokenAddress: ETH_ADDRESSES[CHAIN_ID],
          sellTokenAddress: gasTokenAddress,
          sellAmount: gasAmount,
        },
        {baseUrl: AVNU_URL},
      );
      const gasFeeQuote = gasFeeQuotes[0];

      if (!gasFeeQuote) {
        return NextResponse.json({code: ErrorCode.NO_ROUTE_FOUND}, {status: HTTPStatus.BadRequest});
      }

      if (result.overall_fee > gasFeeQuote.buyAmount) {
        return NextResponse.json(
          {code: ErrorCode.INVALID_GAS_AMOUNT},
          {status: HTTPStatus.BadRequest},
        );
      }

      const {calls: swapCalls} = await fetchBuildExecuteTransaction(
        gasFeeQuote.quoteId,
        account.address,
        undefined,
        undefined,
        {baseUrl: AVNU_URL},
      );

      const {transaction_hash} = await account.execute(
        [
          {
            contractAddress: ESCROW_ADDRESSES[CHAIN_ID],
            entrypoint: Entrypoint.CLAIM,
            calldata: claimCallData,
          },
          ...swapCalls,
        ],
        {
          maxFee: gasFeeQuote.buyAmount,
        },
      );

      return NextResponse.json({transaction_hash}, {status: HTTPStatus.OK});
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {code: ErrorCode.TRANSACTION_ERROR, error},
      {status: HTTPStatus.InternalServerError},
    );
  }
}

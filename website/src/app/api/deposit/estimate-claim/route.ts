import {fetchBuildExecuteTransaction, fetchQuotes} from '@avnu/avnu-sdk';
import {NextRequest, NextResponse} from 'next/server';
import {Calldata} from 'starknet';

import {ESCROW_ADDRESSES, ETH_ADDRESSES} from '@/constants/contracts';
import {AVNU_URL, Entrypoint} from '@/constants/misc';
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
  let gasTokenAddress: string;
  try {
    const {calldata, tokenAddress} = await getClaimCallData(body.data);
    claimCallData = calldata;
    gasTokenAddress = tokenAddress;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({code: error.message}, {status: HTTPStatus.BadRequest});
    }

    throw error;
  }

  try {
    if (gasTokenAddress === ETH_ADDRESSES[await provider.getChainId()]) {
      // ETH fee estimation

      const result = await account.estimateInvokeFee([
        {
          contractAddress: ESCROW_ADDRESSES[await provider.getChainId()],
          entrypoint: Entrypoint.CLAIM,
          calldata: claimCallData,
        },
      ]);

      // Using 1.1 as a multiplier to ensure the fee is enough
      const fee = ((result.overall_fee * BigInt(11)) / BigInt(10)).toString();

      return NextResponse.json({ethFee: fee, tokenFee: fee}, {status: HTTPStatus.OK});
    } else {
      // ERC20 fee estimation

      const quotes = await fetchQuotes(
        {
          sellTokenAddress: ETH_ADDRESSES[await provider.getChainId()],
          buyTokenAddress: gasTokenAddress,
          sellAmount: BigInt(1),
          takerAddress: account.address,
        },
        {baseUrl: AVNU_URL},
      );
      const quote = quotes[0];

      console.log(ETH_ADDRESSES[await provider.getChainId()], gasTokenAddress, quote);

      if (!quote) {
        return NextResponse.json({code: ErrorCode.NO_ROUTE_FOUND}, {status: HTTPStatus.BadRequest});
      }

      const {calls: swapCalls} = await fetchBuildExecuteTransaction(
        quote.quoteId,
        account.address,
        undefined,
        undefined,
        {baseUrl: AVNU_URL},
      );

      const result = await account.estimateInvokeFee([
        {
          contractAddress: ESCROW_ADDRESSES[await provider.getChainId()],
          entrypoint: Entrypoint.CLAIM,
          calldata: claimCallData,
        },
        ...swapCalls,
      ]);

      // Using 1.1 as a multiplier to ensure the fee is enough
      const ethFee = (result.overall_fee * BigInt(11)) / BigInt(10);

      const feeQuotes = await fetchQuotes(
        {
          sellTokenAddress: ETH_ADDRESSES[await provider.getChainId()],
          buyTokenAddress: gasTokenAddress,
          sellAmount: ethFee,
          takerAddress: account.address,
        },
        {baseUrl: AVNU_URL},
      );
      const feeQuote = feeQuotes[0];

      if (!feeQuote) {
        return NextResponse.json({code: ErrorCode.NO_ROUTE_FOUND}, {status: HTTPStatus.BadRequest});
      }

      return NextResponse.json({ethFee, tokenFee: feeQuote.buyAmount}, {status: HTTPStatus.OK});
    }
  } catch (error) {
    return NextResponse.json(
      {code: ErrorCode.ESTIMATION_ERROR, error},
      {status: HTTPStatus.InternalServerError},
    );
  }
}

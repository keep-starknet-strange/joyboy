import {ContractWriteVariables, useContractWrite} from '@starknet-react/core';
import {GetTransactionReceiptResponse} from 'starknet';

import {useTransactionModal} from './useTransactionModal';

export const useTransaction = () => {
  const {show: showTransactionModal, shown} = useTransactionModal();
  const {writeAsync} = useContractWrite({});

  const sendTransaction = async (args: ContractWriteVariables) => {
    if (shown) return;

    showTransactionModal();

    const {transaction_hash} = await writeAsync(args);

    return new Promise<GetTransactionReceiptResponse>((resolve) => {
      showTransactionModal(transaction_hash, resolve);
    });
  };

  return sendTransaction;
};

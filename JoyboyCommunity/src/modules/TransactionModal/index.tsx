import {useWaitForTransaction} from '@starknet-react/core';
import {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {GetTransactionReceiptResponse} from 'starknet';

import {Button, Modal, Text} from '../../components';
import {useTheme} from '../../hooks';
import styles from './styles';

export type TransactionModalProps = {
  transactionHash?: string;
  hide: () => void;
  onReceipt?: (receipt: GetTransactionReceiptResponse) => void;
};

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transactionHash,
  hide,
  onReceipt,
}) => {
  const {theme} = useTheme();

  const [status, setStatus] = useState<'confirmation' | 'processing' | 'success' | 'failure'>(
    'confirmation',
  );
  const [trial, setTrial] = useState(0);

  const {
    data: transactionReceipt,
    error: transactionError,
    isLoading,
    refetch,
  } = useWaitForTransaction({hash: transactionHash});

  useEffect(() => {
    if (transactionHash) setStatus('processing');
  }, [transactionHash]);

  useEffect(() => {
    if (transactionError) {
      if (trial < 3) {
        refetch().then(() => setTrial((prev) => prev + 1));
      } else {
        setStatus('failure');
      }
    }
  }, [transactionError, refetch, trial]);

  useEffect(() => {
    if (transactionReceipt && !isLoading) {
      if (onReceipt) onReceipt(transactionReceipt);

      if (transactionReceipt.isSuccess()) {
        setStatus('success');
      } else {
        setStatus('failure');
      }
    }
  }, [transactionReceipt, isLoading, onReceipt]);

  return (
    <Modal>
      <Text fontSize={16} weight="semiBold">
        Your transaction is {status === 'confirmation' && 'waiting for your confirmation'}
        {status === 'processing' && 'processing'}
        {status === 'success' && 'processed successfully'}
        {status === 'failure' && 'failed'}
      </Text>

      {transactionHash ? (
        <Text fontSize={16} weight="semiBold">
          Transaction Hash: {transactionHash}
        </Text>
      ) : null}

      <View style={styles.indicator}>
        {(status === 'confirmation' || status === 'processing') && (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        )}
      </View>

      <Button onPress={hide}>Close</Button>
    </Modal>
  );
};

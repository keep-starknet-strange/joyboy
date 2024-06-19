import {useAccount} from '@starknet-react/core';
import {forwardRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {Modalize as RNModalize} from 'react-native-modalize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CallData, uint256} from 'starknet';

import {Avatar, Button, Input, Modalize, Picker, Text} from '../../components';
import {ESCROW_ADDRESSES} from '../../constants/contracts';
import {DEFAULT_TIMELOCK, Entrypoint} from '../../constants/misc';
import {TOKENS, TokenSymbol} from '../../constants/tokens';
import {useChainId, useSendTip, useStyles, useTransaction, useWalletModal} from '../../hooks';
import stylesheet from './styles';

export const TipToken = forwardRef<RNModalize>((props, ref) => {
  const styles = useStyles(stylesheet);

  const [token, setToken] = useState<TokenSymbol>(TokenSymbol.JBY);
  const [amount, setAmount] = useState<string>('');

  const chainId = useChainId();
  const account = useAccount();
  const walletModal = useWalletModal();
  const sendTransaction = useTransaction();
  const sendTip = useSendTip();

  const eventId = '9ae37aa68f48645127299e9453eb5d908a0cbb6058ff340d528ed4d37c8994fb';
  const recipient = 'cd576d93bcc79acc48146e96fee40c9775d12fa5e86036498b52ddfc70fb8dcf';

  const isActive = !!amount && !!token;

  const onTipPress = async () => {
    if (!account.address) {
      walletModal.show();
      return;
    }

    const amountUint256 = uint256.bnToUint256(Number(amount) * 10 ** 18); // TODO: use fraction

    const approveCallData = CallData.compile([
      ESCROW_ADDRESSES[chainId], // Contract address
      amountUint256, // Amount
    ]);

    const depositCallData = CallData.compile([
      amountUint256, // Amount
      TOKENS[token][chainId].address, // Token address
      uint256.bnToUint256(`0x${recipient}`), // Recipient nostr pubkey
      DEFAULT_TIMELOCK, // timelock // 7 days
    ]);

    const receipt = await sendTransaction({
      calls: [
        {
          contractAddress: TOKENS[token][chainId].address,
          entrypoint: Entrypoint.APPROVE,
          calldata: approveCallData,
        },
        {
          contractAddress: ESCROW_ADDRESSES[chainId],
          entrypoint: Entrypoint.DEPOSIT,
          calldata: depositCallData,
        },
      ],
    });

    if (receipt.isSuccess()) {
      const transferEvent = receipt.events.find((event) =>
        event.keys.includes('0x1dcde06aabdbca2f80aa51392b345d7549d7757aa855f7e37f5d335ac8243b1'),
      );

      const depositId = Number(transferEvent.data[5]);

      await sendTip.mutateAsync({
        content: '',
        depositId,
        recipient,
        eventId,
        amount: Number(amount),
        symbol: token,
      });

      alert('Tip sent!');
    } else {
      alert('Failed to send tip');
    }
  };

  return (
    <Modalize
      handlePosition={Platform.OS === 'ios' ? 'inside' : 'outside'}
      adjustToContentHeight
      title="Tip"
      ref={ref}
      modalStyle={styles.modal}
    >
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardContent}>
              <Avatar size={48} source={require('../../assets/joyboy-logo.png')} />

              <View>
                <Text fontSize={15} color="text" weight="bold">
                  Abdel 全快 Zenkai 🐉🐺
                </Text>
                <Text fontSize={11} color="textLight" weight="regular">
                  @zenkai
                </Text>
              </View>
            </View>

            <View style={styles.likes}>
              <Text fontSize={11}>16 likes</Text>
            </View>
          </View>

          <Text fontSize={13} weight="medium" color="text" style={styles.cardContentText}>
            Live at Miami Stark Conf 2.0...
          </Text>
        </View>

        <View style={styles.pickerContainer}>
          <View>
            <Picker
              label="Please select a token"
              selectedValue={token}
              onValueChange={(itemValue) => setToken(itemValue as TokenSymbol)}
            >
              {Object.values(TOKENS).map((tkn) => (
                <Picker.Item
                  key={tkn[chainId].symbol}
                  label={tkn[chainId].name}
                  value={tkn[chainId].symbol}
                />
              ))}
            </Picker>
          </View>

          <Input value={amount} onChangeText={setAmount} placeholder="Amount" />
        </View>

        <View style={styles.sending}>
          <View style={styles.sendingText}>
            <Text color="textSecondary" fontSize={16} weight="medium">
              Sending
            </Text>

            {amount.length > 0 && token.length > 0 ? (
              <Text color="primary" fontSize={16} weight="bold">
                {amount} {token}
              </Text>
            ) : (
              <Text color="primary" fontSize={16} weight="bold">
                ...
              </Text>
            )}
          </View>

          <View style={styles.recipient}>
            <Text fontSize={16} weight="regular">
              to
            </Text>
            <Text fontSize={16} weight="medium">
              @zenkai
            </Text>
          </View>
        </View>

        <View style={styles.submitButton}>
          <Button variant="secondary" disabled={!isActive} onPress={onTipPress}>
            {account.address ? 'Tip' : 'Connect Wallet'}
          </Button>
        </View>

        <Text
          weight="semiBold"
          color="inputPlaceholder"
          fontSize={13}
          align="center"
          style={styles.comment}
        >
          Tip friends and support creators with your favorite tokens.
        </Text>
      </SafeAreaView>
    </Modalize>
  );
});
TipToken.displayName = 'TipToken';

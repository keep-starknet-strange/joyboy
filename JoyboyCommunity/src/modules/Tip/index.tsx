import {useAccount} from '@starknet-react/core';
import {Fraction} from '@uniswap/sdk-core';
import {forwardRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {Modalize as RNModalize} from 'react-native-modalize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CallData, uint256} from 'starknet';

import {Avatar, Button, Input, Modalize, Picker, Text} from '../../components';
import {ESCROW_ADDRESSES} from '../../constants/contracts';
import {DEFAULT_TIMELOCK, Entrypoint} from '../../constants/misc';
import {TOKENS, TokenSymbol} from '../../constants/tokens';
import {useChainId, useStyles, useTransaction, useWalletModal} from '../../hooks';
import {decimalsScale} from '../../utils/helpers';
import stylesheet from './styles';

export const TipToken = forwardRef<RNModalize>((props, ref) => {
  const styles = useStyles(stylesheet);

  const [token, setToken] = useState<TokenSymbol>(TokenSymbol.JBY);
  const [amount, setAmount] = useState<string>('');

  const chainId = useChainId();
  const account = useAccount();
  const walletModal = useWalletModal();
  const sendTransaction = useTransaction();

  const recipient = '855a6c52f5cfdbd3b1293487ce5c5ca6899f9e9417441d9f1bb27697321b8249';

  const isActive = !!amount && !!token;

  const onTipPress = async () => {
    if (!account.address) {
      walletModal.show();
      return;
    }

    const amountUint256 = uint256.bnToUint256(
      new Fraction(1, Math.ceil(1 / Number(amount)))
        .multiply(decimalsScale(TOKENS[token][chainId].decimals))
        .toFixed(0),
    );

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

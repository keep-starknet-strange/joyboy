import {NDKEvent} from '@nostr-dev-kit/ndk';
import {useAccount} from '@starknet-react/core';
import {Fraction} from '@uniswap/sdk-core';
import {forwardRef, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CallData, uint256} from 'starknet';

import {Avatar, Button, Input, Modalize, Picker, Text} from '../../components';
import {ESCROW_ADDRESSES} from '../../constants/contracts';
import {DEFAULT_TIMELOCK, Entrypoint} from '../../constants/misc';
import {TOKENS, TokenSymbol} from '../../constants/tokens';
import {
  useChainId,
  useDialog,
  useProfile,
  useStyles,
  useTipModal,
  useTransaction,
  useWaitConnection,
  useWalletModal,
} from '../../hooks';
import {decimalsScale} from '../../utils/helpers';
import stylesheet from './styles';

export type TipModal = Modalize;

export type TipModalProps = {
  event?: NDKEvent;
};

export const TipModal = forwardRef<Modalize, TipModalProps>(({event}, ref) => {
  const styles = useStyles(stylesheet);

  const [token, setToken] = useState<TokenSymbol>(TokenSymbol.ETH);
  const [amount, setAmount] = useState<string>('');

  const {data: profile} = useProfile({publicKey: event?.pubkey});

  const chainId = useChainId();
  const account = useAccount();
  const walletModal = useWalletModal();
  const sendTransaction = useTransaction();
  const waitConnection = useWaitConnection();

  const {hide: hideTipModal, showSuccess, hideSuccess} = useTipModal();
  const {showDialog, hideDialog} = useDialog();

  const isActive = !!amount && !!token;

  const onTipPress = async () => {
    if (!account.address) {
      walletModal.show();

      const result = await waitConnection();
      if (!result) return;
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
      uint256.bnToUint256(`0x${event?.pubkey}`), // Recipient nostr pubkey
      DEFAULT_TIMELOCK, // timelock
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

    if (receipt?.isSuccess()) {
      hideTipModal();
      showSuccess({
        amount: Number(amount),
        symbol: token,
        user:
          (profile?.nip05 && `@${profile.nip05}`) ??
          profile?.displayName ??
          profile?.name ??
          event?.pubkey,
        hide: hideSuccess,
      });
    } else {
      let description = 'Please Try Again Later.';
      if (receipt?.isRejected()) {
        description = receipt.transaction_failure_reason.error_message;
      }

      showDialog({
        title: 'Failed to send the tip',
        description,
        buttons: [{type: 'secondary', label: 'Close', onPress: () => hideDialog()}],
      });
    }
  };

  return (
    <Modalize title="Tip" ref={ref} modalStyle={styles.modal}>
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardContent}>
              <Avatar size={48} source={require('../../assets/joyboy-logo.png')} />

              <View style={styles.cardInfo}>
                <Text
                  fontSize={15}
                  color="text"
                  weight="bold"
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {profile?.displayName ?? profile?.name ?? event?.pubkey}
                </Text>

                {profile?.nip05 && (
                  <Text fontSize={11} color="textLight" weight="regular">
                    @{profile?.nip05}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.likes}>
              <Text fontSize={11}>16 likes</Text>
            </View>
          </View>

          <Text
            fontSize={13}
            weight="medium"
            color="text"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.cardContentText}
          >
            {event?.content}
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
            <Text numberOfLines={1} ellipsizeMode="middle" fontSize={16} weight="medium">
              {(profile?.nip05 && `@${profile.nip05}`) ??
                profile?.displayName ??
                profile?.name ??
                event?.pubkey}
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
TipModal.displayName = 'TipModal';

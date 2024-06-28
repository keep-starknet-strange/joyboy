import {NDKEvent, NDKKind} from '@nostr-dev-kit/ndk';
import {useAccount} from '@starknet-react/core';
import {Fraction} from '@uniswap/sdk-core';
import {FlatList, RefreshControl, View} from 'react-native';
import {byteArray, cairo, CallData, uint256} from 'starknet';

import {Button, Divider, Header, Text} from '../../components';
import {ESCROW_ADDRESSES} from '../../constants/contracts';
import {Entrypoint} from '../../constants/misc';
import {useNostrContext} from '../../context/NostrContext';
import {
  useChainId,
  useStyles,
  useTips,
  useToast,
  useTransaction,
  useWaitConnection,
  useWalletModal,
} from '../../hooks';
import {parseDepositEvents} from '../../utils/events';
import {decimalsScale} from '../../utils/helpers';
import stylesheet from './styles';

export const Tips: React.FC = () => {
  const styles = useStyles(stylesheet);

  const tips = useTips();
  const {ndk} = useNostrContext();

  const account = useAccount();
  const chainId = useChainId();
  const sendTransaction = useTransaction();
  const walletModal = useWalletModal();
  const waitConnection = useWaitConnection();
  const {showToast} = useToast();

  const onClaimPress = async (depositId: number) => {
    if (!account.address) {
      walletModal.show();

      const result = await waitConnection();
      if (!result) return;
    }

    const kind = NDKKind.Text;
    const content = cairo.felt(depositId);
    const tags = [];
    const createdAt = Date.now();

    const event = new NDKEvent(ndk);
    event.kind = kind;
    event.content = `claim ${content}`;
    event.tags = tags;
    event.created_at = createdAt;

    const signature = await event.sign();
    const signatureR = `0x${signature.slice(0, signature.length / 2)}`;
    const signatureS = `0x${signature.slice(signature.length / 2)}`;

    const publicKey = event.pubkey;

    const claimCallData = CallData.compile([
      uint256.bnToUint256(`0x${publicKey}`), // public_key
      createdAt, // created_at
      kind, // kind
      byteArray.byteArrayFromString(JSON.stringify(tags)), // tags
      content, // content
      {
        r: uint256.bnToUint256(signatureR), // signature R
        s: uint256.bnToUint256(signatureS), // signature S
      }, // signature
    ]);

    const receipt = await sendTransaction({
      calls: [
        {
          contractAddress: ESCROW_ADDRESSES[chainId],
          entrypoint: Entrypoint.CLAIM,
          calldata: claimCallData,
        },
      ],
    });

    if (receipt.isSuccess()) {
      showToast({type: 'success', title: 'Tip claimed successfully'});
    } else {
      let description = 'Please Try Again Later.';
      if (receipt.isRejected()) {
        description = receipt.transaction_failure_reason.error_message;
      }

      showToast({type: 'error', title: `Failed to send the tip. ${description}`});
    }
  };

  console.log(
    tips.data.pages
      .flat()
      .map((page) => page.events)
      .flat(),
  );

  return (
    <View style={styles.container}>
      <Header showLogo />

      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={tips.data.pages
          .flat()
          .map((page) => page.events)
          .flat()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.transaction_hash}
        renderItem={({item}) => {
          const event = parseDepositEvents(item, chainId);
          const amount = new Fraction(event.amount, decimalsScale(event.token.decimals)).toFixed(6);

          return (
            <View style={styles.tip}>
              <View style={styles.tokenInfo}>
                <View style={styles.token}>
                  <Text weight="semiBold" fontSize={17}>
                    {amount}
                  </Text>
                  <Text weight="bold" fontSize={17}>
                    {event.token.symbol}
                  </Text>
                </View>

                <View>
                  {event.depositId ? (
                    <Button small variant="primary" onPress={() => onClaimPress(event.depositId)}>
                      Claim
                    </Button>
                  ) : null}
                </View>
              </View>

              <Divider direction="horizontal" />

              <View style={styles.senderInfo}>
                <View style={styles.sender}>
                  <Text weight="semiBold" color="text" numberOfLines={1} ellipsizeMode="middle">
                    {event.sender}
                  </Text>
                </View>

                {/* <View>
                  <Text weight="semiBold" color="textSecondary" fontSize={11}>
                    24/06/2024
                  </Text>
                </View> */}
              </View>
            </View>
          );
        }}
        refreshControl={<RefreshControl refreshing={tips.isFetching} onRefresh={tips.refetch} />}
      />
    </View>
  );
};

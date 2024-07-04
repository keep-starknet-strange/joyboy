import {NDKEvent, NDKKind} from '@nostr-dev-kit/ndk';
import {useAccount} from '@starknet-react/core';
import {Fraction} from '@uniswap/sdk-core';
import {FlatList, RefreshControl, View} from 'react-native';
import {cairo} from 'starknet';

import {Button, Divider, Header, Text} from '../../components';
import {CHAIN_ID} from '../../constants/env';
import {ETH} from '../../constants/tokens';
import {useNostrContext} from '../../context/NostrContext';
import {useStyles, useTips, useWaitConnection} from '../../hooks';
import {useClaim, useEstimateClaim} from '../../hooks/api';
import {useToast, useTransactionModal, useWalletModal} from '../../hooks/modals';
import {decimalsScale} from '../../utils/helpers';
import stylesheet from './styles';

export const Tips: React.FC = () => {
  const styles = useStyles(stylesheet);

  const tips = useTips();
  const {ndk} = useNostrContext();

  const account = useAccount();
  const claim = useClaim();
  const estimateClaim = useEstimateClaim();
  const walletModal = useWalletModal();
  const waitConnection = useWaitConnection();
  const {show: showTransactionModal} = useTransactionModal();
  const {showToast} = useToast();

  const onClaimPress = async (depositId: number) => {
    if (!account.address) {
      walletModal.show();
    }

    const connectedAccount = await waitConnection();
    if (!connectedAccount || !connectedAccount.address) return;

    const getNostrEvent = async (gasAmount: bigint) => {
      const event = new NDKEvent(ndk);
      event.kind = NDKKind.Text;
      event.content = `claim: ${cairo.felt(depositId)},${cairo.felt(
        connectedAccount.address!,
      )},${cairo.felt(ETH[CHAIN_ID].address)},${gasAmount.toString()}`;
      event.tags = [];

      await event.sign();
      return event.rawEvent();
    };

    const feeResult = await estimateClaim.mutateAsync(await getNostrEvent(BigInt(1)));
    const fee = BigInt(feeResult.data.fee);

    const claimResult = await claim.mutateAsync(await getNostrEvent(fee));
    const txHash = claimResult.data.transaction_hash;

    showTransactionModal(txHash, async (receipt) => {
      if (receipt.isSuccess()) {
        tips.refetch();
        showToast({type: 'success', title: 'Tip claimed successfully'});
      } else {
        let description = 'Please Try Again Later.';
        if (receipt.isRejected()) {
          description = receipt.transaction_failure_reason.error_message;
        }

        showToast({type: 'error', title: `Failed to claim the tip. ${description}`});
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header showLogo />

      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={tips.data ?? []}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.event.transaction_hash}
        renderItem={({item}) => {
          const amount = new Fraction(item.amount, decimalsScale(item.token.decimals)).toFixed(6);

          return (
            <View style={styles.tip}>
              <View style={styles.tokenInfo}>
                <View style={styles.token}>
                  <Text weight="semiBold" fontSize={17}>
                    {amount}
                  </Text>
                  <Text weight="bold" fontSize={17}>
                    {item.token.symbol}
                  </Text>
                </View>

                <View>
                  {item.depositId ? (
                    <>
                      {item.claimed ? (
                        <Button small variant="default" disabled>
                          Claimed
                        </Button>
                      ) : (
                        <Button
                          small
                          variant="primary"
                          onPress={() => onClaimPress(item.depositId)}
                        >
                          Claim
                        </Button>
                      )}
                    </>
                  ) : null}
                </View>
              </View>

              <Divider direction="horizontal" />

              <View style={styles.senderInfo}>
                <View style={styles.sender}>
                  <Text weight="semiBold" color="text" numberOfLines={1} ellipsizeMode="middle">
                    {item.sender}
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

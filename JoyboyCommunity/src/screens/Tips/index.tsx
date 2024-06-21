import {NDKEvent, NDKKind} from '@nostr-dev-kit/ndk';
import {useAccount} from '@starknet-react/core';
import {Fraction} from '@uniswap/sdk-core';
import {FlatList, RefreshControl, View} from 'react-native';
import {byteArray, cairo, CallData, uint256} from 'starknet';

import {Button, Header, Text} from '../../components';
import {ESCROW_ADDRESSES} from '../../constants/contracts';
import {Entrypoint} from '../../constants/misc';
import {useNostrContext} from '../../context/NostrContext';
import {useChainId, useTips, useTransaction, useWaitConnection, useWalletModal} from '../../hooks';
import {parseDepositEvents} from '../../utils/events';
import {decimalsScale} from '../../utils/helpers';

export const Tips: React.FC = () => {
  const tips = useTips();
  const {ndk} = useNostrContext();

  const account = useAccount();
  const chainId = useChainId();
  const sendTransaction = useTransaction();
  const walletModal = useWalletModal();
  const waitConnection = useWaitConnection();

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
      alert('Claimed successfully');
    } else {
      alert('Claim failed');
    }
  };

  console.log(
    tips.data.pages
      .flat()
      .map((page) => page.events)
      .flat(),
  );

  return (
    <View style={{flex: 1}}>
      <Header showLogo />

      <View style={{flex: 1, padding: 16}}>
        <Text weight="bold" fontSize={18}>
          Tips
        </Text>

        <FlatList
          style={{flex: 1}}
          data={tips.data.pages
            .flat()
            .map((page) => page.events)
            .flat()}
          keyExtractor={(item) => item.transaction_hash}
          renderItem={({item}) => {
            const event = parseDepositEvents(item, chainId);
            const amount = new Fraction(event.amount, decimalsScale(event.token.decimals)).toFixed(
              6,
            );

            return (
              <View style={{padding: 12}}>
                <Text>Tip</Text>
                <Text>Sender: {event.sender}</Text>
                <Text>Token: {event.token.symbol}</Text>
                <Text>Amount: {amount}</Text>

                {event.depositId ? (
                  <Button onPress={() => onClaimPress(event.depositId)}>Claim</Button>
                ) : null}
              </View>
            );
          }}
          refreshControl={<RefreshControl refreshing={tips.isFetching} onRefresh={tips.refetch} />}
        />
      </View>
    </View>
  );
};

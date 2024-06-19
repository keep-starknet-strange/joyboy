import {NDKEvent, NDKKind} from '@nostr-dev-kit/ndk';
import {useAccount} from '@starknet-react/core';
import {FlatList, View} from 'react-native';
import {byteArray, cairo, CallData, uint256} from 'starknet';

import {Button, Header, Text} from '../../components';
import {ESCROW_ADDRESSES} from '../../constants/contracts';
import {Entrypoint} from '../../constants/misc';
import {useNostrContext} from '../../context/NostrContext';
import {useChainId, useTips, useTransaction, useWalletModal} from '../../hooks';

export const Tips: React.FC = () => {
  const tips = useTips();
  const {ndk} = useNostrContext();

  const account = useAccount();
  const chainId = useChainId();
  const sendTransaction = useTransaction();
  const walletModal = useWalletModal();

  const onClaimPress = async (tip: NDKEvent) => {
    if (!account.address) {
      walletModal.show();
      return;
    }

    const depositId = tip.tags.find((tag) => tag[0] === 'deposit_id')?.[1];
    if (!depositId) {
      alert("This tip doesn't have a deposit ID");
      return;
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

  return (
    <View>
      <Header showLogo />

      <View style={{padding: 16}}>
        <Text weight="bold" fontSize={18}>
          Tips
        </Text>

        <FlatList
          data={tips.data.pages.flat()}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={{padding: 12}}>
              <Text>Tip</Text>
              <Text>Sender: {item.pubkey}</Text>
              <Text>Token: {item.tags.find((tag) => tag[0] === 'symbol')[1]}</Text>
              <Text>Amount: {item.tags.find((tag) => tag[0] === 'amount')[1]}</Text>

              <Button onPress={() => onClaimPress(item)}>Claim</Button>
            </View>
          )}
        />
      </View>
    </View>
  );
};

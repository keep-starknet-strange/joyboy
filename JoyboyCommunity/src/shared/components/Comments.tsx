import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';

import PostComment from './PostComment';
import {SendComment, ViewSendComment} from './styled';
import {Input} from '../../components';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useAuth} from '../../store/auth';
import {Event as EventNostr} from 'nostr-tools';
import {JOYBOY_RELAYS} from '../../utils/relay';
import {
  useGetPoolEventsByQuery,
  useGetPoolEventsTagsByQuery,
  useSendNote,
} from '../../hooks/useNostr';
import {useNostrContext} from '../../context/NostrContext';

const mockEvents = [
  {
    post: {
      content: 'mock content',
      author: 'Roronoa zoro',

      id: '1',
      created_at: '2021-09-01T00:00:00Z',
      pubkey: '1234567890',
    },
    event: {
      content: 'Lets say that One Piece is awesome',
      created_at: 1680638952,
      id: '12e701f23d365c558e7aa1a6f75f0477fb8593d4ad8421c4b326f8193ed42fc7',
      kind: 1,
      pubkey: '49e2566f8b1ef0da8aeb89865a862ead30dd5e1fc1e540edebf980a04fe9e853',
      sig: 'c931395c5db7538d159d6012115b0db9b1d9a5ada52132437cddc1790982727555d0d618f109fce372f0ca0ae33d29a8d3ffae1af879e278fc2ce3c6d123c658',
      tags: [
        ['e', 'a8de2eb8a069fecd33246cd921124541d6242ea76ee85c38bf45ee9b5fb3feb5'],
        ['p', '1989034e56b8f606c724f45a12ce84a11841621aaf7182a1f6564380b9c4276b'],
      ],
    },
    sourceUser: null,
  },
  {
    post: {
      content: 'mock content',
      author: 'Roronoa zoro',

      id: '1',
      created_at: '2021-09-01T00:00:00Z',
      pubkey: '1234567890',
    },
    event: {
      content: 'What about Naruto?',
      created_at: 1680638952,
      id: '12e701f23d365c558e7aa1a6f75f0477fb8593d4ad8421c4b326f8193ed42fc7',
      kind: 1,
      pubkey: '49e2566f8b1ef0da8aeb89865a862ead30dd5e1fc1e540edebf980a04fe9e853',
      sig: 'c931395c5db7538d159d6012115b0db9b1d9a5ada52132437cddc1790982727555d0d618f109fce372f0ca0ae33d29a8d3ffae1af879e278fc2ce3c6d123c658',
      tags: [
        ['e', 'a8de2eb8a069fecd33246cd921124541d6242ea76ee85c38bf45ee9b5fb3feb5'],
        ['p', '1989034e56b8f606c724f45a12ce84a11841621aaf7182a1f6564380b9c4276b'],
      ],
    },
    sourceUser: null,
  },
  {
    post: {
      content: 'mock content',
      author: 'Roronoa zoro',

      id: '1',
      created_at: '2021-09-01T00:00:00Z',
      pubkey: '1234567890',
    },
    event: {
      content: 'Yeaaaah Naruto is sick',
      created_at: 1680638952,
      id: '12e701f23d365c558e7aa1a6f75f0477fb8593d4ad8421c4b326f8193ed42fc7',
      kind: 1,
      pubkey: '49e2566f8b1ef0da8aeb89865a862ead30dd5e1fc1e540edebf980a04fe9e853',
      sig: 'c931395c5db7538d159d6012115b0db9b1d9a5ada52132437cddc1790982727555d0d618f109fce372f0ca0ae33d29a8d3ffae1af879e278fc2ce3c6d123c658',
      tags: [
        ['e', 'a8de2eb8a069fecd33246cd921124541d6242ea76ee85c38bf45ee9b5fb3feb5'],
        ['p', '1989034e56b8f606c724f45a12ce84a11841621aaf7182a1f6564380b9c4276b'],
      ],
    },
    sourceUser: null,
  },
];

interface IComments {
  event?: EventNostr;
}
function Comments({event}: IComments) {
  const [text, setText] = useState<string | undefined>();
  const {privateKey, publicKey} = useAuth();
  const {pool, relays, relayJoyboy} = useNostrContext();
  console.log('event', event);
  const [tags, setTags] = useState<string[][] | undefined>([['e', event?.id]]);

  const [comments, setComments] = useState<EventNostr[] | undefined>([]);
  const sendNote = useSendNote();

  const {
    data: poolEventNotesData,
    isLoading: poolEventNotesDataLoading,
    refetch,
  } = useGetPoolEventsTagsByQuery({
    // ids: ['1'],
    kinds: [1],
    filter: {
      '#e': tags[0],
    },
    pool: pool,
    relaysToUsed: relays,
  });

  useEffect(() => {
    const fetchReplies = async () => {
      if (event?.id) {
        setTags([['e', event?.id]]);
        setComments(poolEventNotesData);
      }
    };
    fetchReplies();
  }, [event, poolEventNotesData]);
  /** @TODO handle send comment */

  const handleSendComment = useCallback(async () => {
    try {
      if (!privateKey) {
        alert('Please login before send a note');
        return;
      }

      if (!text || text?.length == 0) {
        alert('Write your note');
        return;
      }

      /** @TODO handle tags NIP-10  */
      /** tags  */
      // let tags = [['e', event?.id, JOYBOY_RELAYS[0], 'root', publicKey]];
      let tags = [['e', event?.id, '', 'root', publicKey]];
      alert('Note sending, please wait.');

      sendNote.mutate(
        {sk: privateKey, content: text, tags: tags},
        {
          async onSuccess(data) {
            if (data.isValid) {
              alert('Note sent');
            }
            /** Refetch comment */
            await refetch();
          },
          onError(error) {
            console.log('Error send note', error);
          },
        },
      );
    } catch (e) {
      console.log('Error send note', e);
    }
  }, [text, privateKey]);
  const isCreateDisabled = text && text?.length > 0 ? false : true;
  return (
    <View>
      <ViewSendComment>
        <Input
          placeholder="Enter your comment"
          style={{width: '90%'}}
          value={text}
          onChangeText={setText}
        />
        <SendComment
          disabled={isCreateDisabled}
          // style={{backgroundColor: isCreateDisabled && 'gray'}}
          onPress={handleSendComment}
        >
          <MaterialCommunityIcons
            name="send-circle"
            size={24}
            color={isCreateDisabled ? 'gray' : 'black'}
          />
        </SendComment>
      </ViewSendComment>

      <FlatList
        horizontal={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        data={[...comments]}
        ItemSeparatorComponent={() => <View style={{height: 18}} />}
        renderItem={({item}) => {
          return <PostComment event={item} />;
          // return <PostComment event={item?.event} post={item?.post} sourceUser={item.sourceUser} />;
        }}
      />
    </View>
  );
}

export default Comments;

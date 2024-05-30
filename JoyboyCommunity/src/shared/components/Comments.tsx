import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Event as EventNostr} from 'nostr-tools';
import {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';

import {Input} from '../../components';
import {useNostrContext} from '../../context/NostrContext';
import {useGetPoolEventsTagsByQuery, useSendNote} from '../../hooks/useNostr';
import {useAuth} from '../../store/auth';
import PostComment from './PostComment';
import {SendComment, ViewSendComment} from './styled';

interface IComments {
  event?: EventNostr;
}
function Comments({event}: IComments) {
  const [text, setText] = useState<string | undefined>();
  const {privateKey, publicKey} = useAuth();
  const {pool, relays} = useNostrContext();
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
    pool,
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
      const tags = [['e', event?.id, '', 'root', publicKey]];
      alert('Note sending, please wait.');

      sendNote.mutate(
        {sk: privateKey, content: text, tags},
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

      {poolEventNotesDataLoading && <ActivityIndicator />}

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

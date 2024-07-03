import {useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';

import {Divider, Header, IconButton, Input, KeyboardFixedView} from '../../components';
import {useNote, useReplyNotes, useSendNote, useStyles} from '../../hooks';
import {useToast} from '../../hooks/modals';
import {Post} from '../../modules/Post';
import {PostDetailScreenProps} from '../../types';
import stylesheet from './styles';

export const PostDetail: React.FC<PostDetailScreenProps> = ({navigation, route}) => {
  const {postId, post} = route.params;

  const styles = useStyles(stylesheet);

  const [comment, setComment] = useState('');

  const sendNote = useSendNote();
  const {data: note = post} = useNote({noteId: postId});
  const comments = useReplyNotes({noteId: note?.id});
  const queryClient = useQueryClient();
  const {showToast} = useToast();

  const handleSendComment = async () => {
    if (!comment || comment?.length == 0) {
      showToast({type: 'error', title: 'Please write your comment'});
      return;
    }

    sendNote.mutate(
      {content: comment, tags: [['e', note?.id ?? '', '', 'root', note?.pubkey ?? '']]},
      {
        onSuccess() {
          showToast({type: 'success', title: 'Comment sent successfully'});
          queryClient.invalidateQueries({queryKey: ['replyNotes', note?.id]});
          setComment('');
        },
        onError() {
          showToast({
            type: 'error',
            title: 'Error! Comment could not be sent. Please try again later.',
          });
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <Header
        showLogo={false}
        left={<IconButton icon="ChevronLeftIcon" size={24} onPress={navigation.goBack} />}
        right={<IconButton icon="MoreHorizontalIcon" size={24} />}
        title="Conversation"
      />

      <Divider />

      <View style={styles.content}>
        <FlatList
          style={styles.content}
          data={comments.data?.pages.flat()}
          automaticallyAdjustKeyboardInsets
          ListHeaderComponent={
            <>
              <View style={styles.post}>
                <Post event={note} />
              </View>

              <Divider />
            </>
          }
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({item}) => (
            <View style={styles.comment}>
              <Post asComment event={item} />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={comments.isFetching} onRefresh={() => comments.refetch()} />
          }
          onEndReached={() => comments.fetchNextPage()}
        />
      </View>

      <KeyboardFixedView containerProps={{style: styles.commentInputContainer}}>
        <Divider />

        <View style={styles.commentInputContent}>
          <Input
            value={comment}
            onChangeText={setComment}
            containerStyle={styles.commentInput}
            placeholder="Comment"
          />

          <IconButton icon="SendIcon" size={24} onPress={handleSendComment} />
        </View>
      </KeyboardFixedView>
    </View>
  );
};

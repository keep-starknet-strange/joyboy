import {useCallback, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';

import {Divider, Header, IconButton, Input, KeyboardFixedView} from '../../components';
import {useNote, useReplyNotes, useSendNote, useStyles} from '../../hooks';
import {Post} from '../../modules/Post';
import {PostDetailScreenProps} from '../../types';
import stylesheet from './styles';

export const PostDetail: React.FC<PostDetailScreenProps> = ({navigation, route}) => {
  const {postId, post} = route.params;

  const styles = useStyles(stylesheet);

  const [comment, setComment] = useState('');

  const sendNote = useSendNote();
  const {data: note = post} = useNote({noteId: postId});
  const comments = useReplyNotes({noteId: note.id});

  const handleSendComment = useCallback(async () => {
    try {
      if (!comment || comment?.length == 0) {
        alert('Write your note');
        return;
      }

      sendNote.mutate(
        {content: comment, tags: [['e', note.id, '', 'root', note.pubkey]]},
        {
          async onSuccess(data) {
            if (data) alert('Note sent');

            await comments.refetch();
          },
          onError(error) {
            console.log('Error send note', error);
          },
        },
      );
    } catch (e) {
      console.log('Error send note', e);
    }
  }, [comment, note.id, note.pubkey, sendNote, comments]);

  console.log(comments.data);

  return (
    <View style={styles.container}>
      <Header
        showLogo={false}
        left={<IconButton icon="chevron-left" size={24} onPress={navigation.goBack} />}
        right={<IconButton icon="more-horizontal" size={24} />}
        title="Conversation"
      />

      <Divider />

      <View style={styles.content}>
        <FlatList
          style={styles.content}
          data={comments.data.pages.flat()}
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

          <IconButton icon="send" size={24} onPress={handleSendComment} />
        </View>
      </KeyboardFixedView>
    </View>
  );
};

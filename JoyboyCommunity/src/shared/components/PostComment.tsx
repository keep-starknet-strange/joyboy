import {Octicons} from '@expo/vector-icons';
import {NDKEvent} from '@nostr-dev-kit/ndk';
import {Image, Text, View} from 'react-native';
import styled from 'styled-components/native';

import {Post as PostType} from '../../types';
import {Icon} from './Post';

const PostCommentCard = styled(View)`
  padding: 18px 10px;
  border-bottom-width: 1;
  border-bottom-color: #eff0f1;
`;

const PostLayout = styled(View)`
  flex-direction: row;
`;

interface PostCommentProps {
  post?: PostType;
  event?: NDKEvent;
  sourceUser?: string;
}
export const PostComment: React.FC<PostCommentProps> = (props) => {
  const {post, event, sourceUser} = props;

  return (
    <PostCommentCard>
      <PostLayout>
        <View style={{marginRight: 10}}>
          <Image
            source={sourceUser ?? require('../../../assets/joyboy-logo.png')}
            style={{width: 44, height: 44}}
          />
        </View>

        <View style={{gap: 4, flex: 1}}>
          <Text style={{color: 'black', fontWeight: '700'}}>{event?.pubkey}</Text>

          {post?.source && (
            <Image
              source={{uri: post.source}}
              style={{
                width: '100%',

                height: 200,
                borderRadius: 8,
                marginTop: 8,
              }}
            />
          )}
        </View>

        <Icon as={Octicons} name="heart" size={24} color="black" style={{alignSelf: 'center'}} />
      </PostLayout>
      <Text style={{color: 'black', marginTop: 10}}>{event?.content}</Text>
    </PostCommentCard>
  );
};

export default PostComment;

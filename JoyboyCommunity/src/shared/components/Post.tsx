import {MaterialIcons, Octicons} from '@expo/vector-icons';
import {NDKEvent} from '@nostr-dev-kit/ndk';
import {useNavigation} from '@react-navigation/native';
import {Image, Pressable, Text, View} from 'react-native';
import styled from 'styled-components/native';

import {Typography} from '../../components';
import {MainStackNavigationProps, Post as PostType} from '../../types';

const PostCard = styled(View)`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 8px;
  margin: 0 20px 18px 20px;
`;
const PostLayout = styled(View)`
  flex-direction: row;
`;

export const InteractionContainer = styled(View)`
  margin-top: 30px;
  width: 100%;
  display: flex;
  gap: 8px;
  flex-direction: row;
  align-content: center;
  align-self: center;
  justify-content: space-between;
`;

export const Icon = styled(View)`
  padding-horizontal: 4px;
`;

interface PostProps {
  post?: PostType; // TODO FIX and use only typed event
  event?: NDKEvent;
  sourceUser?: string;
  repostedEvent?: NDKEvent;
}

export const Post: React.FC<PostProps> = (props) => {
  const {post, event, repostedEvent} = props;
  const navigation = useNavigation<MainStackNavigationProps>();
  const handleProfilePress = (userId?: string) => {
    if (userId) {
      navigation.navigate('Profile', {publicKey: userId});
    }
  };

  /** @TODO comment in Nostr */
  const handleComment = () => {};

  /** @TODO comment in Nostr */
  const handleLike = () => {};

  /** @TODO repost in Nostr */
  const handleRepostNote = () => {
    alert('Handle repost');
  };

  const handleNavigateToPostDetails = () => {
    navigation.navigate('PostDetail', {postId: event?.id, post: event});
  };
  /** @TODO react in Nostr */
  const handleReact = () => {};

  return (
    <PostCard>
      {repostedEvent && (
        <View>
          <Typography>Reposted</Typography>
        </View>
      )}
      {/* TODO different rendering base on kind =1,6,7 and tags for kind = 1 */}
      <PostLayout>
        <View style={{marginRight: 10}}>
          <Pressable onPress={() => handleProfilePress(event?.pubkey)}>
            <Image
              source={props?.sourceUser ?? require('../../../assets/joyboy-logo.png')}
              style={{width: 44, height: 44}}
            />
          </Pressable>
        </View>

        <View style={{gap: 4, flex: 1}}>
          <Pressable onPress={handleNavigateToPostDetails}>
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
          </Pressable>
        </View>

        {/* TODO check tags if it's:
        quote
        repost
        reply  */}
        <Icon
          as={Octicons}
          name="heart"
          size={24}
          color="black"
          onPress={handleLike}
          style={{alignSelf: 'center'}}
        />
      </PostLayout>
      <Pressable onPress={handleNavigateToPostDetails}>
        <Text style={{color: 'black', marginTop: 10}}>
          {repostedEvent?.content ? repostedEvent?.content : event?.content}
        </Text>
      </Pressable>
      <InteractionContainer>
        <Pressable onPress={handleNavigateToPostDetails} style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Icon as={Octicons} name="comment" size={18} color="#406686" onPress={handleComment} />
            <Text style={{color: '#406686', fontWeight: '500', fontSize: 11}}>16 comments</Text>
          </View>
        </Pressable>
        <Icon
          as={MaterialIcons}
          name="more-horiz"
          size={18}
          color="#406686"
          onPress={handleReact}
        />
      </InteractionContainer>
    </PostCard>
  );
};

import {MaterialIcons} from '@expo/vector-icons';
import {NDKEvent} from '@nostr-dev-kit/ndk';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

import {CommentIcon, LikeFillIcon, LikeIcon, RepostIcon} from '../../assets/icons';
import {Typography} from '../../components';
import {MainStackNavigationProps, Post as PostType} from '../../types';
import {timestampToHumanReadable} from '../../utils/common-utils';

export const Icon = styled(View)`
  padding-horizontal: 4px;
`;

const FlexView = styled(View)`
  display: flex;
  flex-direction: row;
`;

const RepostMessage = styled(Typography)`
  font-size: 14px;
  color: #8f979d;
  position: relative;
  bottom: 3px;
  margin-bottom: 5px;
`;

const PostCard = styled(View)`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 8px;
  margin: 0 16px 24px 16px;
`;

const PostHeader = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const PostTitle = styled(Text)`
  color: #121212;
  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
`;

const PostSubtitleWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  margin-top: 2px;
  align-items: center;
`;

const PostSubtitle = styled(Text)`
  color: #8f979d;
  font-size: 11px;
  line-height: 16px;
`;

const PostSubtitleCenterElement = styled(View)`
  margin-left: 16px;
  margin-right: 7px;
  height: 3px;
  width: 3px;
  border-radius: 1.5px;
  background-color: #8f979d;
`;

const PostContent = styled(View)`
  display: flex;
  margin-bottom: 16px;
`;

const PostContentText = styled(Text)`
  font-size: 13px;
  line-height: 20px;
  color: #000;
`;

const LikeWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 2px;
`;

const LikeText = styled(Animated.Text)`
  font-size: 11px;
  color: #406686;
  line-height: 16px;
`;

const AnimatedIcon = styled(Animated.View)`
  height: 20px;
`;

const PostFooter = styled(View)`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const CommentWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const CommentsText = styled(Text)`
  color: #6b6b8c;
  font-size: 11px;
  line-height: 16px;
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

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(12); // static value for now

  const scale = useSharedValue(1); // Control scale for icon animation

  // Animated style for the icon
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handleProfilePress = (userId?: string) => {
    if (userId) {
      navigation.navigate('Profile', {publicKey: userId});
    }
  };

  /** @TODO comment in Nostr */
  const handleComment = () => {};

  /** @TODO repost in Nostr */
  const handleRepostNote = () => {
    alert('Handle repost');
  };

  const handleNavigateToPostDetails = () => {
    navigation.navigate('PostDetail', {postId: event?.id, post: event});
  };

  /** @TODO react in Nostr */
  const handleReact = () => {};

  /** @TODO comment in Nostr */
  const toggleLike = () => {
    setIsLiked((prevIsLiked) => {
      const newIsLiked = !prevIsLiked;
      setLikes((prevLikes) => {
        const newLikes = newIsLiked ? prevLikes + 1 : prevLikes - 1;

        // Only trigger the animation if not unliking from 1 like to zero
        if (!(prevLikes === 1 && !newIsLiked)) {
          scale.value = withSequence(
            withTiming(1.5, {duration: 100, easing: Easing.out(Easing.ease)}), // Scale up
            withSpring(1, {damping: 6, stiffness: 200}), // Bounce back
          );
        }

        return newLikes;
      });
      return newIsLiked;
    });
  };

  return (
    <PostCard>
      {/* to show reposted message */}
      {repostedEvent && (
        <FlexView>
          <RepostIcon color="#8f979d" height={18} />
          <RepostMessage>Reposted</RepostMessage>
        </FlexView>
      )}
      {/* TODO different rendering base on kind =1,6,7 and tags for kind = 1 */}
      <PostHeader>
        <FlexView>
          <Pressable onPress={() => handleProfilePress(event?.pubkey)}>
            <Image
              source={props?.sourceUser ?? require('../../../assets/joyboy-logo.png')}
              style={{width: 50, height: 50}}
            />
          </Pressable>

          <Pressable onPress={handleNavigateToPostDetails} style={{marginLeft: 10}}>
            {/* using static data for name */}
            <PostTitle>Monkey D Luffy</PostTitle>
            <PostSubtitleWrapper>
              <PostSubtitle>@luffy</PostSubtitle>
              <PostSubtitleCenterElement />
              <PostSubtitle>{timestampToHumanReadable(event.created_at)}</PostSubtitle>
            </PostSubtitleWrapper>
          </Pressable>
        </FlexView>

        <Pressable onPress={toggleLike}>
          <LikeWrapper>
            <AnimatedIcon style={animatedIconStyle}>
              {isLiked ? (
                <LikeFillIcon height={20} color="#FF7463" />
              ) : (
                <LikeIcon height={20} color="#14142C" />
              )}
            </AnimatedIcon>
            {likes > 0 && (
              <LikeText>
                {likes} {likes === 1 ? 'like' : 'likes'}
              </LikeText>
            )}
          </LikeWrapper>
        </Pressable>
      </PostHeader>

      <PostContent>
        <Pressable onPress={handleNavigateToPostDetails}>
          <PostContentText>{repostedEvent?.content ?? event?.content}</PostContentText>

          {post?.source && (
            <Image
              source={{uri: post.source}}
              style={{
                width: '100%',
                height: 160,
                borderRadius: 8,
                marginTop: 12,
                objectFit: 'cover',
              }}
            />
          )}
        </Pressable>
      </PostContent>

      {/* TODO check tags if it's:
        quote
        repost
        reply  */}
      <PostFooter>
        <Pressable onPress={handleNavigateToPostDetails}>
          <CommentWrapper>
            <CommentIcon height={20} color="#6B6B8C" onPress={handleComment} />
            <CommentsText>16 comments</CommentsText>
          </CommentWrapper>
        </Pressable>
        <Icon
          as={MaterialIcons}
          name="more-horiz"
          size={24}
          color="#6b6b8c"
          onPress={handleReact}
        />
      </PostFooter>
    </PostCard>
  );
};

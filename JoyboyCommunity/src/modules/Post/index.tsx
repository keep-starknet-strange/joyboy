import {MaterialIcons} from '@expo/vector-icons';
import {NDKEvent} from '@nostr-dev-kit/ndk';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {Image, Pressable, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {CommentIcon, LikeFillIcon, LikeIcon, RepostIcon} from '../../assets/icons';
import {Text} from '../../components';
import {useStyles, useTheme} from '../../hooks';
import {MainStackNavigationProps} from '../../types';
import {timestampToHumanReadable} from '../../utils/common-utils';
import stylesheet from './styles';

export type PostProps = {
  asComment?: boolean;
  event?: NDKEvent;
};

export const Post: React.FC<PostProps> = ({asComment, event}) => {
  const repostedEvent = undefined;
  const postSource = undefined;

  const navigation = useNavigation<MainStackNavigationProps>();

  const theme = useTheme();
  const styles = useStyles(stylesheet, asComment);

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

  const handleMore = () => {};

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
    <View style={styles.container}>
      {repostedEvent && (
        <View style={styles.repost}>
          <RepostIcon color={theme.colors.textLight} height={18} />
          <Text color="textLight">Reposted</Text>
        </View>
      )}

      {/* TODO: different rendering base on kind =1,6,7 and tags for kind = 1 */}

      <View style={styles.info}>
        <View style={styles.infoUser}>
          <Pressable onPress={() => handleProfilePress(event?.pubkey)}>
            <Image
              source={require('../../../assets/joyboy-logo.png')}
              style={styles.infoUserAvatar}
            />
          </Pressable>

          <Pressable onPress={handleNavigateToPostDetails}>
            <Text weight="bold" color="textStrong" fontSize={asComment ? 13 : 15} lineHeight={20}>
              Monkey D Luffy
            </Text>

            <View style={styles.infoDetails}>
              <Text color="textLight" fontSize={11} lineHeight={16}>
                @luffy
              </Text>

              <View style={styles.infoDetailsDivider} />

              <Text color="textLight" fontSize={11} lineHeight={16}>
                {timestampToHumanReadable(event.created_at)}
              </Text>
            </View>
          </Pressable>
        </View>

        <Pressable onPress={toggleLike}>
          <View style={styles.infoLikes}>
            <Animated.View style={animatedIconStyle}>
              {isLiked ? (
                <LikeFillIcon height={20} color={theme.colors.primary} />
              ) : (
                <LikeIcon height={20} color={theme.colors.text} />
              )}
            </Animated.View>

            {likes > 0 && (
              <Text color="textSecondary" fontSize={11} lineHeight={16}>
                {likes} {likes === 1 ? 'like' : 'likes'}
              </Text>
            )}
          </View>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Pressable onPress={handleNavigateToPostDetails}>
          <Text color="textStrong" fontSize={13} lineHeight={20}>
            {repostedEvent?.content ?? event?.content}
          </Text>

          {postSource && (
            <Image source={{uri: postSource}} resizeMode="cover" style={styles.contentImage} />
          )}
        </Pressable>
      </View>

      {/* TODO: check tags if it's: quote repost reply  */}

      {!asComment && (
        <View style={styles.footer}>
          <Pressable onPress={handleNavigateToPostDetails}>
            <View style={styles.footerComments}>
              <CommentIcon height={20} color={theme.colors.textSecondary} onPress={handleComment} />

              <Text color="textSecondary" fontSize={11} lineHeight={16}>
                16 comments
              </Text>
            </View>
          </Pressable>

          <MaterialIcons
            name="more-horiz"
            size={24}
            color={theme.colors.textSecondary}
            onPress={handleMore}
          />
        </View>
      )}
    </View>
  );
};

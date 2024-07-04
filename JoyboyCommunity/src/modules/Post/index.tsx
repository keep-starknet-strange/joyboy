import {NDKEvent} from '@nostr-dev-kit/ndk';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {useMemo, useState} from 'react';
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
import {Avatar, IconButton, Menu, Text} from '../../components';
import {useProfile, useReact, useReactions, useReplyNotes, useStyles, useTheme} from '../../hooks';
import {useTipModal} from '../../hooks/modals';
import {useAuth} from '../../store/auth';
import {MainStackNavigationProps} from '../../types';
import {getElapsedTimeStringFull} from '../../utils/timestamp';
import stylesheet from './styles';

export type PostProps = {
  asComment?: boolean;
  event?: NDKEvent;
};

export const Post: React.FC<PostProps> = ({asComment, event}) => {
  const repostedEvent = undefined;
  const postSource = undefined;

  const theme = useTheme();
  const styles = useStyles(stylesheet);

  const navigation = useNavigation<MainStackNavigationProps>();

  const {publicKey} = useAuth();
  const {show: showTipModal} = useTipModal();
  const {data: profile} = useProfile({publicKey: event?.pubkey});
  const reactions = useReactions({noteId: event?.id});
  const userReaction = useReactions({authors: [publicKey], noteId: event?.id});
  const comments = useReplyNotes({noteId: event?.id});
  const react = useReact();
  const queryClient = useQueryClient();

  const [menuOpen, setMenuOpen] = useState(false);

  const scale = useSharedValue(1);

  const isLiked = useMemo(
    () =>
      Array.isArray(userReaction.data) &&
      userReaction.data[0] &&
      userReaction.data[0]?.content !== '-',
    [userReaction.data],
  );

  const likes = useMemo(() => {
    if (!reactions.data) return 0;

    const likesCount = reactions.data.filter((reaction) => reaction.content !== '-').length;
    const dislikesCount = reactions.data.length - likesCount;
    return likesCount - dislikesCount;
  }, [reactions.data]);

  // Animated style for the icon
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handleProfilePress = (userId?: string) => {
    if (userId) {
      navigation.navigate('Profile', {publicKey: userId});
    }
  };

  const handleNavigateToPostDetails = () => {
    if (!event?.id) return;
    navigation.navigate('PostDetail', {postId: event?.id, post: event});
  };

  /** @TODO comment in Nostr */
  const toggleLike = async () => {
    if (!event?.id) return;

    await react.mutateAsync(
      {event, type: isLiked ? 'dislike' : 'like'},
      {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['reactions', event?.id]});

          scale.value = withSequence(
            withTiming(1.5, {duration: 100, easing: Easing.out(Easing.ease)}), // Scale up
            withSpring(1, {damping: 6, stiffness: 200}), // Bounce back
          );
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      {repostedEvent && (
        <View style={styles.repost}>
          <RepostIcon color={theme.colors.textLight} height={18} />
          <Text color="textLight">Reposted</Text>
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.infoUser}>
          <Pressable onPress={() => handleProfilePress(event?.pubkey)}>
            <Avatar size={asComment ? 40 : 50} source={require('../../assets/joyboy-logo.png')} />
          </Pressable>

          <Pressable style={styles.infoProfile} onPress={handleNavigateToPostDetails}>
            <Text
              weight="bold"
              color="textStrong"
              fontSize={asComment ? 13 : 15}
              lineHeight={20}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {profile?.displayName ?? profile?.name ?? event?.pubkey}
            </Text>

            <View style={styles.infoDetails}>
              {profile?.nip05 && (
                <>
                  <Text color="textLight" fontSize={11} lineHeight={16}>
                    @{profile?.nip05}
                  </Text>

                  <View style={styles.infoDetailsDivider} />
                </>
              )}

              <Text color="textLight" fontSize={11} lineHeight={16}>
                {getElapsedTimeStringFull((event?.created_at ?? Date.now()) * 1000)}
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
            {event?.content}
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
              <CommentIcon height={20} color={theme.colors.textSecondary} />

              <Text color="textSecondary" fontSize={11} lineHeight={16}>
                {comments.data?.pages.flat().length} comments
              </Text>
            </View>
          </Pressable>

          <Menu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            handle={
              <IconButton icon="MoreHorizontalIcon" size={20} onPress={() => setMenuOpen(true)} />
            }
          >
            <Menu.Item label="Share" icon="ShareIcon" />
            <Menu.Item
              label={profile?.username ? `Tip @${profile.username}` : 'Tip'}
              icon="CoinIcon"
              onPress={() => {
                if (!event) return;

                showTipModal(event);
                setMenuOpen(false);
              }}
            />
          </Menu>
        </View>
      )}
    </View>
  );
};

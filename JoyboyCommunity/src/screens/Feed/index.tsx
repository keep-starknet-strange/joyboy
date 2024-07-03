import {FlatList, Image, Pressable, RefreshControl, View} from 'react-native';

import {AddPostIcon} from '../../assets/icons';
import {Header} from '../../components';
import {useRootNotes, useStyles, useTheme} from '../../hooks';
import {PostCard} from '../../modules/PostCard';
import {FeedScreenProps} from '../../types';
import stylesheet from './styles';

export const Feed: React.FC<FeedScreenProps> = ({navigation}) => {
  const theme = useTheme();
  const styles = useStyles(stylesheet);
  const notes = useRootNotes();

  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={require('../../assets/feed-background.png')}
        resizeMode="cover"
      />

      <Header />

      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={notes.data?.pages.flat()}
        keyExtractor={(item) => item?.id}
        renderItem={({item}) => <PostCard event={item} />}
        refreshControl={
          <RefreshControl refreshing={notes.isFetching} onRefresh={() => notes.refetch()} />
        }
        onEndReached={() => notes.fetchNextPage()}
      />

      <Pressable
        style={styles.createPostButton}
        onPress={() => navigation.navigate('MainStack', {screen: 'CreatePost'})}
      >
        <AddPostIcon width={72} height={72} color={theme.colors.primary} />
      </Pressable>
    </View>
  );
};

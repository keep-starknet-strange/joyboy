import {FlatList, Image, Pressable, RefreshControl, View} from 'react-native';

import {AddPostIcon} from '../../assets/icons';
import {Header, Story} from '../../components';
import {useRootNotes, useStyles, useTheme} from '../../hooks';
import {PostCard} from '../../modules/PostCard';
import {FeedScreenProps} from '../../types';
import stylesheet from './styles';

export const Feed: React.FC<FeedScreenProps> = ({navigation}) => {
  const theme = useTheme();
  const styles = useStyles(stylesheet);

  const notes = useRootNotes();

  const stories = [
    {name: 'Luffy', img: require('../../assets/feed/images/story-1.png')},
    {name: 'Usopp', img: require('../../assets/feed/images/story-2.png')},
    {name: 'Steph', img: require('../../assets/feed/images/story-3.png')},
    {name: 'Roronoa Z', img: require('../../assets/feed/images/story-4.png')},
    {name: 'Franky', img: require('../../assets/feed/images/story-5.png')},
    {name: 'Franky', img: require('../../assets/feed/images/story-5.png')},
    {name: 'Franky', img: require('../../assets/feed/images/story-5.png')},
    {name: 'Franky', img: require('../../assets/feed/images/story-5.png')},
  ];

  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={require('../../assets/feed/feed-bg.png')}
        resizeMode="cover"
      />

      <Header />

      <FlatList
        ListHeaderComponent={
          <FlatList
            contentContainerStyle={styles.stories}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={stories}
            ItemSeparatorComponent={() => <View style={styles.storySeparator} />}
            renderItem={({item}) => <Story name={item.name} image={item.img} />}
          />
        }
        data={notes.data.pages.flat()}
        keyExtractor={(item) => item?.id}
        renderItem={({item}) => <PostCard event={item} />}
        refreshControl={
          <RefreshControl refreshing={notes.isFetching} onRefresh={() => notes.refetch()} />
        }
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

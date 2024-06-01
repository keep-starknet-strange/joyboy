import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {ActivityIndicator, Image, Text, View} from 'react-native';
import {FlatList, RefreshControl} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import {Header} from '../../components';
import {useRootNotes} from '../../hooks';
import {Post} from '../../shared/components/Post';
import FloatingPostButton from './FloatingPostButton';
import {styles} from './style';

const FixedPostButton = styled(View)`
  position: absolute;
  bottom: 40px;
  right: 15px;
`;

export const Feed: React.FC = () => {
  const bottomBarHeight = useBottomTabBarHeight();

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
      <Image source={require('../../assets/feed/feed-bg.png')} style={styles.backgroundImage} />

      <Header />

      {notes.isLoading && <ActivityIndicator />}

      <FlatList
        ListHeaderComponent={
          <View style={{paddingBottom: 18}}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={stories}
              ListHeaderComponent={() => <View style={{width: 18}} />}
              ItemSeparatorComponent={() => <View style={{width: 18}} />}
              renderItem={({item}) => {
                return (
                  <View style={{alignItems: 'center'}}>
                    <View
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        source={require('../../assets/feed/images/story-bg.png')}
                        resizeMode="cover"
                      />
                      <Image style={{position: 'absolute'}} source={item.img} resizeMode="cover" />
                    </View>
                    <Text style={styles.storyText}>{item.name}</Text>
                  </View>
                );
              }}
            />
          </View>
        }
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: bottomBarHeight,
        }}
        data={notes.data.pages.flat()}
        keyExtractor={(item) => item?.id}
        renderItem={({item}) => {
          return (
            <Post
              // post={item}
              event={item}
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={notes.isFetching} onRefresh={() => notes.refetch()} />
        }
      />

      <FixedPostButton>
        <FloatingPostButton />
      </FixedPostButton>
    </View>
  );
};

import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import React from 'react';
import {ActivityIndicator, Image, ImageBackground, Text, View} from 'react-native';
import {FlatList, RefreshControl} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import {useGetPoolEventsNotes} from '../../hooks/useNostr';
import {Post} from '../../shared/components/Post';
import FloatingPostButton from './FloatingPostButton';
import {styles} from './style';

const FixedPostButton = styled(View)`
  position: absolute;
  bottom: 40px;
  right: 15px;
`;

export default function Feed() {
  const bottomBarHeight = useBottomTabBarHeight();

  const {
    data: poolEventNotesData,
    isLoading: poolEventNotesDataLoading,
    refetch,
  } = useGetPoolEventsNotes();

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
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/feed/feed-bg.png')}
        style={styles.linearGradient}
      >
        <View style={{paddingTop: 30, paddingBottom: 18}}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={stories}
            ListHeaderComponent={() => <View style={{width: 18}} />}
            ItemSeparatorComponent={() => <View style={{width: 18}} />}
            renderItem={({item}) => {
              return (
                <View style={styles.stories}>
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

        {poolEventNotesDataLoading && <ActivityIndicator />}

        <FlatList
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: bottomBarHeight,
          }}
          data={poolEventNotesData}
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
            <RefreshControl refreshing={poolEventNotesDataLoading} onRefresh={() => refetch()} />
          }
        />
      </ImageBackground>
      <FixedPostButton>
        <FloatingPostButton />
      </FixedPostButton>
    </SafeAreaView>
  );
}

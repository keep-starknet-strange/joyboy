import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, SafeAreaView, View, Text, Image, ImageBackground} from 'react-native';
import {FlatList, RefreshControl} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {useNostr} from '../../hooks/useNostr';
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
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(true);
  const {getEvents, setEvents, events, getEventsNotes, eventsData} = useNostr();
  const [eventsDataFeed, setEventsData] = useState(events ?? []);
  const handeGetData = useCallback(async () => {
    setLoading(true);

    // run a promise for two seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // add additional data to previous data
    const events = await getEventsNotes(true);
    setEvents(events);
    setEventsData(events);
    setLoading(false);
  }, []);

  const fetchPageData = useCallback(async () => {
    setIsReady(false);
    setLoading(true);
    const events = await getEventsNotes(true);
    console.log('events', events);
    setEvents(events);
    setEventsData(events);
    setLoading(false);
    setIsReady(true);
  }, []);

  useEffect(() => {
    fetchPageData();
  }, []);

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
                  <View style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={require('../../assets/feed/images/story-bg.png')} resizeMode="cover" />
                    <Image
                      style={{position: 'absolute', }}
                      source={item.img}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.storyText}>{item.name}</Text>
                </View>
              );
            }}
          />
        </View>

        {loading && <ActivityIndicator></ActivityIndicator>}

        <FlatList
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: bottomBarHeight,
          }}
          data={eventsDataFeed}
          keyExtractor={(item) => item?.id}
          renderItem={({item}) => {
            return (
              <Post
                // post={item}
                event={item}
              />
            );
          }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={handeGetData} />}
        />
      </ImageBackground>
      <FixedPostButton>
        <FloatingPostButton />
      </FixedPostButton>
    </SafeAreaView>
  );
}

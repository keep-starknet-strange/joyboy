import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import React from 'react';
import {ActivityIndicator, SafeAreaView, View} from 'react-native';
import {FlatList, RefreshControl} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import {useRootNotes} from '../../hooks/useRootNotes';
import {Post} from '../../shared/components/Post';
import FloatingPostButton from './FloatingPostButton';

const FixedPostButton = styled(View)`
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

export default function Feed() {
  const bottomBarHeight = useBottomTabBarHeight();

  const notes = useRootNotes();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f4f7fe'}}>
      <View style={{paddingTop: 12, paddingBottom: 18}}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          ListHeaderComponent={() => <View style={{width: 18}} />}
          ItemSeparatorComponent={() => <View style={{width: 18}} />}
          renderItem={() => {
            return (
              <View
                style={{
                  backgroundColor: '#e4e4e7',
                  height: 64,
                  width: 64,
                  borderRadius: 32,
                }}
              />
            );
          }}
        />
      </View>

      {notes.isLoading && <ActivityIndicator />}

      <FlatList
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: bottomBarHeight,
        }}
        data={notes.data?.pages.flat()}
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
    </SafeAreaView>
  );
}

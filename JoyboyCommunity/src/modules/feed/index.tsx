import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import FloatingPostButton from "./components/FloatingPostButton";
import styled, { useTheme } from "styled-components/native";
import Post from "../../shared/components/Post";
import { testPostData } from "../../shared/data/testData";
import Divider from "../../components/divider/Divider";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { useNostr } from "../../hooks/useNostr";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const FixedPostButton = styled(View)`
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

export default function Feed() {
  const theme = useTheme();
  const bottomBarHeight = useBottomTabBarHeight();
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(true);

  const { getEvents, setEvents, events, getEventsNotes, eventsData } =
    useNostr();

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
    console.log("events", events);
    setEvents(events);
    setEventsData(events);
    setLoading(false)
    setIsReady(true);
  }, []);

  useEffect(() => {
    fetchPageData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingTop: 12, paddingBottom: 18 }}>

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          ListHeaderComponent={() => <View style={{ width: 18 }} />}
          ItemSeparatorComponent={() => <View style={{ width: 18 }} />}
          renderItem={() => {
            return (
              <View
                style={{
                  backgroundColor: "#e4e4e7",
                  height: 64,
                  width: 64,
                  borderRadius: 32,
                }}
              />
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
        renderItem={({ item }) => {
          return (
            <Post
              // post={item}
              event={item}
            />
          );
        }}
        ItemSeparatorComponent={() => (
          <View style={{ marginVertical: 18 }}>
            <Divider />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handeGetData} />
        }
      />

      <FixedPostButton>
        <FloatingPostButton />
      </FixedPostButton>
    </SafeAreaView>
  );
}

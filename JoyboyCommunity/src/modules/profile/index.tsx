import { View, Image, StyleSheet, Platform } from "react-native";
import React from "react";
import styled, { useTheme } from "styled-components/native";
import Typography from "../../components/typography";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Divider from "../../components/divider/Divider";
import { testPostData } from "../../shared/data/testData";
import Post from "../../shared/components/Post";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import ScrollableContainer from "../../components/skeleton/ScrollableContainer";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const FirstRoute = () => {
  const bottomBarHeight = useBottomTabBarHeight();
  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: 16,
        paddingBottom: bottomBarHeight,
      }}
      data={testPostData}
      keyExtractor={(item) => item?.id}
      renderItem={({ item }) => {
        return <Post post={item} />;
      }}
      ItemSeparatorComponent={() => (
        <View style={{ marginVertical: 18 }}>
          <Divider />
        </View>
      )}
    />
  );
};

const SecondRoute = () => {
  const bottomBarHeight = useBottomTabBarHeight();

  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: 16,
        paddingBottom: bottomBarHeight,
      }}
      data={testPostData}
      keyExtractor={(item) => item?.id}
      renderItem={({ item }) => {
        return <Post post={item} />;
      }}
      ItemSeparatorComponent={() => (
        <View style={{ marginVertical: 18 }}>
          <Divider />
        </View>
      )}
    />
  );
};

const ThirdRoute = () => {
  const bottomBarHeight = useBottomTabBarHeight();
  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: 16,
        paddingBottom: bottomBarHeight,
      }}
      data={testPostData}
      keyExtractor={(item) => item?.id}
      renderItem={({ item }) => {
        return <Post post={item} />;
      }}
      ItemSeparatorComponent={() => (
        <View style={{ marginVertical: 18 }}>
          <Divider />
        </View>
      )}
    />
  );
};

export default function Profile() {
  const theme = useTheme();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "posts", title: "Posts" },
    { key: "replies", title: "Replies" },
    { key: "likes", title: "Likes" },
  ]);

  const renderScene = SceneMap({
    posts: FirstRoute,
    replies: SecondRoute,
    likes: ThirdRoute,
  });

  const renderTabBar = (props) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.tabBar}>
          {props.navigationState.routes.map((route, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.tabItem,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor:
                      index === i ? theme.black[10] : "transparent",
                  },
                ]}
                onPress={() => setIndex(i)}
              >
                <Typography
                  variant="ts15b"
                  align="left"
                  colorCode={index === i ? theme.black[10] : theme.black[40]}
                >
                  {route.title}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: "relative", marginTop: -10, height: 270 }}>
        <Image
          source={{ uri: "https://picsum.photos/200/300" }}
          style={{
            width: Platform.OS != "android" ? "100%" : 250,

            height: 200,
            resizeMode: "cover",
            marginTop: 8,
          }}
        />
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: "https://picsum.photos/201/300" }}
            style={{
              borderWidth: 2,
              borderColor: "white",
              height: 100,
              width: 100,
              resizeMode: "cover",
              borderRadius: 50,
              left: 12,
              top: 0,
              transform: [{ translateY: -50 }],
            }}
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: 12, gap: 4 }}>
        <Typography variant="ts19m" colorCode={theme.black[10]}>
          Cool Name
        </Typography>

        <Typography variant="ts15r" colorCode={theme.black[10]}>
          user's bio where they add something about themselves
        </Typography>
      </View>
      <View style={{ flex: 1, paddingTop: 8 }}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    width: Platform.OS != "android" ? "100%" : 250,

    paddingHorizontal: 4,
    flexDirection: "row",
    borderBottomColor: "#e4e4e7",
    borderBottomWidth: 1,
  },
  tabItem: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: "flex-start",
  },
});

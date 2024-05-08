// src/screens/FeedScreen.js

import React from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import PostCard from "../components/PostCard";
import CardPost from "../components/CardPost";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";

const postData = [
  {
    id: "1",
    content: "Hello Joyboy World!",
    author: "User1",
    source: undefined,
  },
  {
    id: "2",
    content: "Another post in Joyboy",
    author: "User2",
    source: undefined,
  },
];

function FeedScreen({ navigation }) {
  return (
    <>
      <View
        style={styles.container}
        // style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <FlatList
          data={postData}
          // horizontal={true}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          style={styles.listContainer}
          renderItem={({ item }) => (
            <>
              <PostCard navigation={navigation} post={item}></PostCard>
            </>
          )}
        />
        <Button
          title="Post Something"
          onPress={() => navigation.navigate("Profile")}
        />
        <BottomBar navigation={navigation}></BottomBar>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  // container: {
  //   flex: 1,
  //   width: "100%",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   width: "100%",
  //   // backgroundColor: '#fff', // Background color of the top bar
  //   paddingTop: 30, // Adjust this value to add spacing if needed
  //   paddingBottom: 10,
  //   paddingHorizontal: 20,
  //   borderBottomWidth: 1,
  //   // borderBottomColor: '#ccc', // Border color
  //   alignItems: "center",
  // },
  listContainer: {
    width: "100%", // Ensure the FlatList occupies the entire width
    paddingHorizontal: 20, // Add horizontal padding to create space between items
  },
  item: {
    // width: 150, // Set width of each item
    // height: 100, // Set height of each item
    // backgroundColor: "#ccc",
    // justifyContent: "center",
    // alignItems: "center",
    // marginHorizontal: 5, // Add margin between items
    // borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default FeedScreen;

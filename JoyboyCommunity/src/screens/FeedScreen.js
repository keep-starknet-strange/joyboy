// src/screens/FeedScreen.js

import React from "react";
import { View, Text, FlatList, Button } from "react-native";
import PostCard from "../components/PostCard";
import CardPost from "../components/CardPost";

const postData = [
  { id: "1", content: "Hello Joyboy World!", author: "User1", source:undefined },
  { id: "2", content: "Another post in Joyboy", author: "User2", source:undefined},
];

function FeedScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <FlatList
        data={postData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <CardPost navigation={navigation} post={item}></CardPost>
            <PostCard navigation={navigation} post={item}></PostCard>
          </>
        )}
      />
      <Button
        title="Post Something"
        onPress={() => navigation.navigate("Profile")}
      />
    </View>
  );
}

export default FeedScreen;

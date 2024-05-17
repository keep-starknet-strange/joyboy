import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import styled from "styled-components/native";
import { Event as EventNostr } from "nostr-tools";
import { useNavigation } from "@react-navigation/native";

const PostLayout = styled(View)`
  flex-direction: row;
  gap: 18px;
  padding: 0px 12px;
`;

interface PostProps {
  post?: {
    content: string;
    author: string;
    timestamp?: number;
    source?: string;
    id: string;
    created_at: string;
    pubkey: string;
  }; // TODO FIX and use only typed event
  event?: EventNostr;
}

export default function Post(props: PostProps) {
  const { post, event } = props;
  const navigation = useNavigation();
  const handleProfilePress = (userId?: string) => {
    if (userId) {
      navigation.navigate("UserDetailScreen", { userId });
    }
  };

  return (
    <PostLayout>
      <View style={{ flex: 0.1 }}>
        <Pressable onPress={() => handleProfilePress(event?.pubkey)}>
          <Image
            source={require("../../../assets/joyboy-logo.png")}
            style={{ width: 44, height: 44 }}
          />
        </Pressable>
      </View>

      <View style={{ gap: 4, flex: 0.9 }}>
        <Text style={{ color: "black", fontWeight: "700" }}>
          {event?.pubkey}
        </Text>
        <Text style={{ color: "black" }}>{event?.content}</Text>
        {post?.source && (
          <Image
            source={{ uri: post.source }}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 8,
              marginTop: 8,
            }}
          />
        )}
      </View>
    </PostLayout>
  );
}

import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import styled from "styled-components/native";
import { Event as EventNostr } from "nostr-tools";

const PostLayout = styled(View)`
  flex-direction: row;
  gap: 18px;
  padding: 0px 12px;
`;

interface PostProps {
  post: {
    content: string;
    author: string;
    timestamp: number;
    source: string;
    id: string;
    created_at: string;
    pubkey: string;
  };
  event?: EventNostr;
}

export default function Post(props: PostProps) {
  const { post } = props;

  return (
    <PostLayout>
      <View style={{ flex: 0.1 }}>
        <Image
          source={require("../../../assets/joyboy-logo.png")}
          style={{ width: 44, height: 44 }}
        />
      </View>

      <View style={{ gap: 4, flex: 0.9 }}>
        <Text style={{ color: "black", fontWeight: "700" }}>{post.author}</Text>
        <Text style={{ color: "black" }}>{post.content}</Text>
        {post.source && (
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

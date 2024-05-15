import { View, Text, Image } from "react-native";
import React from "react";
import styled from "styled-components/native";

const NotificationLayout = styled(View)`
  flex-direction: row;
  gap: 18px;
  padding: 0px 12px;
`;

type NotificationProps = {
  post: {
    id: number;
    content: string;
    username: string;
    image?: string;
  };
};

export default function Notification(props: NotificationProps) {
  const { post } = props;
  return (
    <NotificationLayout>
      <View style={{ flex: 0.1 }}>
        <Image
          source={require("../../../../assets/joyboy-logo.png")}
          style={{ width: 44, height: 44 }}
        />
      </View>

      <View style={{ gap: 4, flex: 0.9 }}>
        <Text style={{ color: "black", fontWeight: "700" }}>
          {post.author}
        </Text>
        <Text style={{ color: "black" }}>{post.content}</Text>
        {post.image && (
          <Image
            source={{ uri: post.image }}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 8,
              marginTop: 8,
            }}
          />
        )}
      </View>
    </NotificationLayout>
  );
}

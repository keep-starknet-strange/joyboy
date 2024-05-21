import { View, Text, Image, Platform } from "react-native";
import React from "react";
import { NotificationLayout } from "./styled";

export type NotificationProps = {
  post: {
    id?: string;
    content: string;
    username?: string;
    image?: string;
    author?: string;
  };
};

export const Notification: React.FC<NotificationProps> = ({ post }) => {
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
          {post?.author}
        </Text>
        <Text style={{ color: "black" }}>{post.content}</Text>
        {post.image && (
          <Image
            source={{ uri: post.image }}
            style={{
              width: Platform.OS == "ios" ? "100%" : 250,
              height: 200,
              borderRadius: 8,
              marginTop: 8,
            }}
          />
        )}
      </View>
    </NotificationLayout>
  );
};

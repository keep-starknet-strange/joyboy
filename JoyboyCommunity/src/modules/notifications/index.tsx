import { View } from "react-native";
import React from "react";
import {
  LayoutContainer,
  ScrollableContainer,
  Divider,
} from "../../components";
import { testPostData } from "../../shared/data/testData";
import { Notification } from "./Notification";

export default function Notifications() {
  return (
    <LayoutContainer title="Notifications">
      <ScrollableContainer
        contentContainerStyle={{
          // width: "100%"
          width: "100%",
          flex: 1,
        }}
      >
        <View style={{ paddingVertical: 12, flex: 1, gap: 18, width: "100%" }}>
          {testPostData.map((post, i) => (
            <View key={post.id} style={{ gap: 12 }}>
              <Notification
                post={{
                  author: post?.pubkey,
                  content: post?.content,
                  username: post?.pubkey,
                  id: post?.id,
                }}
              />
              <Divider />
            </View>
          ))}
        </View>
      </ScrollableContainer>
    </LayoutContainer>
  );
}

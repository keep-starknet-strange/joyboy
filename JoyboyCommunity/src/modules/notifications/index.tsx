import { View, Text } from "react-native";
import React from "react";
import LayoutContainer from "../../components/skeleton/LayoutContainer";
import ScrollableContainer from "../../components/skeleton/ScrollableContainer";
import { testPostData } from "../../shared/data/testData";
import Divider from "../../components/divider/Divider";
import Post from "../../shared/components/Post";
import Notification from "./components/Notification";

export default function Notifications() {
  return (
    <LayoutContainer title="Notifications">
      <ScrollableContainer contentContainerStyle={{ width: "100%", flex: 1 }}>
        <View style={{ paddingVertical: 12, flex: 1, gap: 18, width: "100%" }}>
          {testPostData.map((post) => (
            <View key={post.id} style={{ gap: 12 }}>
              <Notification post={post} />
              <Divider />
            </View>
          ))}
        </View>
      </ScrollableContainer>
    </LayoutContainer>
  );
}

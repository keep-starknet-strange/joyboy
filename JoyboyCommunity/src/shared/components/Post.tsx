import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import styled from "styled-components/native";
import { Event as EventNostr } from "nostr-tools";
import { useNavigation } from "@react-navigation/native";
import { Typography } from "../../components";
import { Octicons, MaterialIcons } from "@expo/vector-icons";
import { Post as PostType, RootStackNavigationProps } from "../../types";

const PostLayout = styled(View)`
  flex-direction: row;
  gap: 18px;
  padding: 0px 12px;
`;

export const InteractionContainer = styled(View)`
  margin-vertical: 10px;
  margin-horizontal: 20px;
  display: flex;
  gap: 8px;
  flex-direction: row;
  align-content: center;
  align-self: center;
`;

export const Icon = styled(View)`
  padding-horizontal: 4px;
`;

interface PostProps {
  post?: PostType; // TODO FIX and use only typed event
  event?: EventNostr;
  sourceUser?: string;
  repostedEvent?: EventNostr;
}

export const Post: React.FC<PostProps> = (props) => {
  const { post, event, repostedEvent } = props;
  const navigation = useNavigation<RootStackNavigationProps>();
  const handleProfilePress = (userId?: string) => {
    if (userId) {
      navigation.navigate("UserDetail", { userId });
    }
  };

  /** @TODO comment in Nostr */
  const handleComment = () => {};

  /** @TODO repost in Nostr */
  const handleRepostNote = () => {
    alert("Handle repost");
  };

  /** @TODO react in Nostr */
  const handleReact = () => {};

  return (
    <View>
      {repostedEvent && (
        <View>
          <Typography>Reposted</Typography>
        </View>
      )}
      {/* TODO different rendering base on kind =1,6,7 and tags for kind = 1 */}
      <PostLayout>
        <View style={{ flex: 0.1 }}>
          <Pressable onPress={() => handleProfilePress(event?.pubkey)}>
            <Image
              source={
                props?.sourceUser ?? require("../../../assets/joyboy-logo.png")
              }
              style={{ width: 44, height: 44 }}
            />
          </Pressable>
        </View>

        <View style={{ gap: 4, flex: 0.9 }}>
          <Text style={{ color: "black", fontWeight: "700" }}>
            {event?.pubkey}
          </Text>
          <Text style={{ color: "black" }}>
            {repostedEvent?.content ? repostedEvent?.content : event?.content}
          </Text>

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
        {/* TODO check tags if it's:
        quote
        repost
        reply  */}
      </PostLayout>

      <InteractionContainer>
        <Icon
          as={Octicons}
          name="comment"
          size={24}
          color="black"
          onPress={handleComment}
        />
        <Icon
          as={Octicons}
          name="share"
          size={24}
          color="black"
          onPress={handleRepostNote}
        />

        <Icon
          as={MaterialIcons}
          name="add-reaction"
          size={24}
          color="black"
          onPress={handleReact}
        />
      </InteractionContainer>
    </View>
  );
};

import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import React from "react";
import styled from "styled-components/native";
import { Event as EventNostr } from "nostr-tools";
import { useNavigation } from "@react-navigation/native";
import Typography from "../../components/typography";
import { Octicons, Ionicons, MaterialIcons } from "@expo/vector-icons";

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
  sourceUser?: string;
  repostedEvent?: EventNostr;
}

export default function Post(props: PostProps) {
  const { post, event, repostedEvent } = props;
  const navigation = useNavigation();
  const handleProfilePress = (userId?: string) => {
    if (userId) {
      navigation.navigate("UserDetailScreen", { userId });
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
                width: Platform.OS != "android" ? "100%" : 250,

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

      <View style={styles.interactionContainer}>
        <Octicons
          style={styles.icon}
          name="comment"
          size={24}
          color="black"
          onPress={handleComment}
        />
        <Octicons
          style={styles.icon}
          name="share"
          size={24}
          color="black"
          onPress={handleRepostNote}
        />

        <MaterialIcons
          style={styles.icon}
          name="add-reaction"
          size={24}
          color="black"
          onPress={handleReact}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  interactionContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
    display: "flex",
    gap: 8,
    flexDirection: "row",
    alignContent: "center",
    alignSelf: "center",
  },
  icon: {
    paddingHorizontal: 4,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "white",
  },
});

// src/screens/FeedScreen.js

import { View, Text } from "react-native";
import { Avatar } from "../avatar";
import styles from "./styles";

export const PostPage: React.FC<{ post: any }> = ({ post }) => {
  const { content, author, timestamp, source, pubkey } = post;

  return (
    <View style={styles.card}>
      <View style={styles.authorContainer}>
        <Avatar source={source} userId={pubkey} />
        <Text style={styles.author}>{author}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.content}>{content}</Text>
      </View>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate("Home", {
        })}
      ></TouchableOpacity> */}
    </View>
  );
};

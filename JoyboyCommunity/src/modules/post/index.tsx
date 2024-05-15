import { View, Image, Pressable } from "react-native";
import React, { useCallback } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Typography from "../../components/typography";
import KeyboardAvoidingView from "../../components/skeleton/KeyboardAvoidingView";
import Divider from "../../components/divider/Divider";

export default function CreatePost() {
  const navigation = useNavigation();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const handlePost = useCallback(() => {
    // do something on post
  }, []);

  return (
    <KeyboardAvoidingView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: 16,
        }}
      >
        <Pressable onPress={handleGoBack}>
          <Typography variant="ts15r">Cancel</Typography>
        </Pressable>
        <Pressable onPress={handlePost}>
          <Typography variant="ts15r">Post</Typography>
        </Pressable>
      </View>
      <View style={{ marginBottom: 12 }}>
        <Divider />
      </View>
      <View style={{ paddingHorizontal: 12, flexDirection: "row", gap: 8 }}>
        <Image
          source={{ uri: "https://picsum.photos/201/300" }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <TextInput autoFocus multiline={true} placeholder="Title" />
      </View>
    </KeyboardAvoidingView>
  );
}

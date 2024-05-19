import { View, Image, Pressable, Platform } from "react-native";
import React, { useCallback, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Typography from "../../components/typography";
import KeyboardAvoidingView from "../../components/skeleton/KeyboardAvoidingView";
import Divider from "../../components/divider/Divider";
import { useNostr } from "../../hooks/useNostr";
import { useLocalstorage } from "../../hooks/useLocalstorage";
import styled from "styled-components";

const CreateButton = styled(Pressable)`
  border-radius: 8px;
  padding: 8px 24px;
  border-color: black;
  border: 1px;
  color: white;
`;

export default function CreatePost() {
  const navigation = useNavigation();

  const { sendNote } = useNostr();
  const { retrieveAndDecryptPrivateKey } = useLocalstorage();
  const [note, setNote] = useState<string | undefined>();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const handlePost = useCallback(async () => {
    try {
      // do something on post
      if (!note || note?.length == 0) {
        alert("Write your note");
        return;
      }
      alert("Note sending");
      let { array } = await retrieveAndDecryptPrivateKey();

      if (!array) {
        alert("Please login");
        return;
      }
      let noteEvent = sendNote(array, note);
      console.log("noteEvent", noteEvent);
      if (noteEvent?.isValid) {
        alert("Note send");
      }
    } catch (e) {
      console.log("Error send note", e);
    }
  }, [note]);
  const isCreateDisabled = note && note?.length > 0 ? true : false;

  return (
    <KeyboardAvoidingView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: Platform.OS != "android" ? "100%" : 250,
          padding: 16,
        }}
      >
        <Pressable onPress={handleGoBack}>
          <Typography variant="ts15r">Cancel</Typography>
        </Pressable>
        <CreateButton
          onPress={handlePost}
          // style={{
          //   paddingVertical: 8,
          //   width: Platform.OS != "android" ? "100%" : 100,
          //   backgroundColor: isCreateDisabled && "gray",
          // }}
          disabled={isCreateDisabled}
        >
          <Typography variant="ts15r">Post</Typography>
        </CreateButton>
      </View>
      <View style={{ marginBottom: 12 }}>
        <Divider />
      </View>
      <View style={{ paddingHorizontal: 12, flexDirection: "row", gap: 8 }}>
        <Image
          source={{ uri: "https://picsum.photos/201/300" }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <TextInput
          autoFocus
          multiline={true}
          value={note}
          placeholder="Title"
          onChangeText={setNote}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

import React, { useState } from "react";
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Button,
} from "react-native";
import { IPostNote } from "../../types/index";
export const CreateNote = ({ navigation, source }) => {
  const onSubmit = (text?: string) => {};
  const [text, setText] = useState("");

  const [post, setPost] = useState<IPostNote | undefined>({
    content: undefined,
  });

  const handleChangeText = (inputText: string) => {
    setText(inputText);
  };

  const handleSubmit = () => {
    onSubmit(text);
    setText(""); // Clear the input after submitting
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleChangeText}
        placeholder="Write your content here"
      ></TextInput>
      <Button title="Create note" onPress={() => console.log("Create note")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

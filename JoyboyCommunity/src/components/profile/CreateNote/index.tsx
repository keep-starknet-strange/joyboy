import React, { useState } from "react";
import { TextInput, View, Button } from "react-native";
import { IPostNote } from "../../../types/index";
import styles from "./styles";

export const CreateNote: React.FC = () => {
  const [text, setText] = useState("");
  const [post, setPost] = useState<IPostNote | undefined>({
    content: undefined,
  });

  const onSubmit = (text?: string) => {};

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
        multiline
        value={text}
        onChangeText={handleChangeText}
        placeholder="Write your note here"
      />

      <Button title="Create note" onPress={handleSubmit} />
    </View>
  );
};

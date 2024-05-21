import React, { useState } from "react";
import { TextInput, TouchableOpacity, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IProfileNostr } from "../../../types";
import { HomeNavigationProp } from "../../../types";
import styles from "./styles";

export const EditProfile: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();

  const [text, setText] = useState("");
  const [profile, setProfile] = useState<IProfileNostr | undefined>({});

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
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleChangeText}
          placeholder="Enter your handle..."
        />

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleChangeText}
          placeholder="Bio of your profile"
        />
      </TouchableOpacity>

      <Button
        title="Edit Profile"
        onPress={() => console.log("Edit profile")}
      />
    </View>
  );
};

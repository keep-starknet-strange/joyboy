import React, { useState } from "react";
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Button,
} from "react-native";

export const EditProfile = ({ navigation, source }) => {
  const onSubmit = (text?: string) => {};
  const [text, setText] = useState("");

  const [profile, setProfile] = useState<IProfileNostr | undefined>({});

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
        ></TextInput>

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleChangeText}
          placeholder="Bio of your profile"
        ></TextInput>
      </TouchableOpacity>
      <Button
        title="Edit Profile"
        onPress={() => console.log("Edit profile")}
      />
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

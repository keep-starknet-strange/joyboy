import React from "react";
import { Image, TouchableOpacity } from "react-native";

export const Avatar = ({ navigation, source , userId}) => {
  const handleProfilePress = (userId: string) => {
    navigation.navigate("UserDetailScreen", { userId });
  };

  return (
    <TouchableOpacity onPress={() => handleProfilePress(userId)}>
      <Image
        // source={{ uri:  "@expo/snack-static/joyboy-logo.png" }}
        source={source ?? require("../../assets/joyboy-logo.png")}
        // source={{ uri:  "@expo/snack-static/react-native-logo.png" }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
    </TouchableOpacity>
  );
};

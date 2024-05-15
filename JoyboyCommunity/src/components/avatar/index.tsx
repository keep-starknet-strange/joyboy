import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, TouchableOpacity } from "react-native";

export const Avatar = ({ source, userId }) => {
  const navigation = useNavigation();
  const handleProfilePress = (userId: string) => {
    navigation.push("UserDetailScreen", { userId });
  };

  return (
    <TouchableOpacity onPress={() => handleProfilePress(userId)}>
      <Image
        source={source ?? require("../../../assets/joyboy-logo.png")}
        style={{ width: 44, height: 44 }}
      />
    </TouchableOpacity>
  );
};

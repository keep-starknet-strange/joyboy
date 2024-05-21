import { View, Text, Pressable } from "react-native";
import React from "react";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProps } from "../../../types";

const CircleButton = styled(Pressable)`
  width: 56px;
  height: 56px;
  background-color: black;
  border-radius: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function FloatingPostButton() {
  const navigation = useNavigation<RootStackNavigationProps>();

  const handleNavigation = () => {
    navigation.push("CreatePost");
  };

  return (
    <CircleButton onPress={handleNavigation}>
      <Feather name="plus" size={24} color="white" />
    </CircleButton>
  );
}

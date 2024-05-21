import {
  Image,
  View,
  Text as RNText,
  TouchableOpacity,
  Pressable,
} from "react-native";
import styled from "styled-components";

export const BackButton = styled(Pressable)`
  border-radius: 8px;
  padding: 8px 24px;
  color: white;
  border-color: black;
`;

export const Container = styled(View)`
  height: 350px;
  color: white;
  gap: 4px;
  flex: 0.9;
`;

export const TabContainer = styled(View)`
  padding: 4px;
  gap: 4px;
  flex: 0.9;
`;

export const ProfilePicture = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 20px;
`;

export const ProfileContainer = styled(View)`
  padding-horizontal: 12px;
  gap: 4px;
  padding: 8px;
`;

export const Text = styled(RNText)`
  color: black;
  font-size: 16px;
  text-align: left;
  margin-bottom: 20px;
  width: 100%;
`;

export const ListContainer = styled(View)`
  width: 100%;
  padding-horizontal: 20px; /* Add horizontal padding to create space between items */
`;

export const Title = styled(RNText)`
  font-size: 20px;
  font-weight: bold;
`;

export const TabBar = styled(View)`
  width: 100%;
  padding-horizontal: 4px;
  flex-direction: row;
  border-bottom-color: #e4e4e7;
  border-bottom-width: 1px;
`;

export const TabItem = styled(TouchableOpacity)`
  margin-horizontal: 8px;
  padding: 8px 4px;
  align-items: flex-start;
`;

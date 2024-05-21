import { Text, View } from "react-native";
import styled from "styled-components";

export const Card = styled(View)`
  /* backgroundColor: "#022b3a"; */
  width: 100%;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 2px;
  }
  shadow-opacity: 0.2;
  shadow-radius: 2px;
  elevation: 2;
`;

export const ContentBox = styled(View)`
  padding: 8px;
  margin-bottom: 8px;
`;

export const Content = styled(Text)`
  font-size: 16px;
`;

export const AuthorContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Author = styled(Text)`
  font-size: 14px;
  color: #333;
`;

export const Timestamp = styled(Text)`
  font-size: 12px;
  color: #666;
`;

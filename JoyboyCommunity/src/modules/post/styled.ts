import {Image, Pressable, View} from 'react-native';
import styled from 'styled-components/native';

export const Container = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
`;

export const PostButton = styled(Pressable)`
  padding: 8px;
  border-radius: 8px;
  background-color: ${(props) => props.disabled && 'gray'};
  border-color: black;
`;

export const TitleContainer = styled(View)`
  padding-horizontal: 12px;
  flex-direction: row;
  gap: 8px;
`;

export const Photo = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

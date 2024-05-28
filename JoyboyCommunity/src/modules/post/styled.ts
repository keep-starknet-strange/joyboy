import {Image, Pressable, View} from 'react-native';
import styled from 'styled-components/native';

export const Container = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 11px 16px;
  margin: 0 16px;
  display: flex;
`;

export const PostButton = styled(Pressable)`
  border-radius: 8px;
  border-color: black;
`;

export const TitleContainer = styled(View)`
  flex-direction: row;
  gap: 8px;
  background: #f4f9ff;
  width: 100%;
  height: 50%;
  display: flex;
  flex: 1;
  align-items: flex-start;
  padding: 10px 16px;
`;

export const Photo = styled(View)`
  width: 32px;
  height: 32px;
  border-radius: 25px;
  margin-left: 16px;
  margin: 10px 0;
`;

export const Logo = styled(Image)`
  width: 200px;
  height: 200px;
`;

export const IconContainer = styled(View)`
  flex-direction: row;
  gap: 24px;
`;

export const Icons = styled(Image)`
  width: 24px;
  height: 24px;
  margin-left: 10px;
`;

export const SendbuttonContainer = styled(View)`
  margin-left: 10px;
  align-self: flex-end;
  margin: 0 4px;
`;

export const IconDiv = styled(View)`
  display: flex;
  flex-direction: column;
  background: #f4f9ff;
  padding: 12px 16px;
`;

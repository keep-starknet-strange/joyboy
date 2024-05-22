import {Image, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';

export const TabBarContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
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
  border-bottom-width: 1px;
`;

export const ImageContainer = styled(View)`
  position: relative;
  margin-top: -10px;
  height: 270px;
`;

export const CoverImage = styled(Image)`
  width: 100%;
  height: 200px;
  resize-mode: cover;
  margin-top: 8px;
`;

export const ProfileImage = styled(Image)`
  border-width: 2px;
  border-color: white;
  height: 100px;
  width: 100px;
  resize-mode: cover;
  border-radius: 50px;
  left: 12px;
  top: 0px;
  transform: translateY(-50px);
`;

export const AboutContainer = styled(View)`
  padding-horizontal: 12px;
  gap: 4px;
`;

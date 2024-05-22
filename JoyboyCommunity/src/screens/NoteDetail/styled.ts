import {Image, Text as RNText, View} from 'react-native';
import styled from 'styled-components/native';

export const Container = styled(View)`
  flex: 1;
  align-items: center;
  background-color: #022b3a;
  height: 100%;
  color: white;
  padding: 4px;
`;

export const Text = styled(RNText)`
  color: white;
`;

export const ContentContainer = styled(View)`
  padding: 8px;
`;

export const ListContainer = styled(View)`
  width: 100%;
  padding-horizontal: 20px; /* Add horizontal padding to create space between items */
`;

export const Title = styled(Text)`
  font-size: 20px;
  font-weight: bold;
`;

export const Timestamp = styled(Text)`
  font-size: 12px;
  color: #666;
`;

export const ProfileImage = styled(Image)`
  width: 50px;
  height: 50px;
`;

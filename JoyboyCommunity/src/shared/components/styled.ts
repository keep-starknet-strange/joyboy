import {Pressable, View} from 'react-native';
import styled from 'styled-components/native';

export const ViewSendComment = styled(View)`
  flex-direction: row;
  align-items: baseline;
  border-radius: 8px;
  padding: 8px 24px;
  border-color: black;
  color: white;
`;

export const SendComment = styled(Pressable)`
  border-radius: 8px;
  padding: 8px 24px;
  border-color: black;
  color: white;
`;

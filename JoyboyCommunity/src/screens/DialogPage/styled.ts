import {Image, Pressable, View} from 'react-native';
import styled from 'styled-components/native';

export const Container = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 11px 16px;
  margin: 0 16px;
  display: flex;
  align-items: center;
`;

export const Logo = styled(Image)`
  width: 140px;
  height: 40px;
`;

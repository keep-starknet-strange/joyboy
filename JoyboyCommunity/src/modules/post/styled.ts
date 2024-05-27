import {Image, Pressable, View} from 'react-native';
import styled from 'styled-components/native';

export const Container = styled(View)`
  flex-direction: row;
  justify-content: space-between;

  padding: 11px 16px;
  margin: 0 16px;
  display: flex;

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
  background: #F4F9FF;
  width: 100%; 
  height: 50%;
  display: flex;
  flex:1;
  align-items: flex-start;
  padding: 10px 16px;
`;

export const Photo = styled(Image)`
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
  gap: 8px;
`;

export const Icons = styled(Image)`
    width: 24px;
    height: 24px;
    resize: 'contain';
    margin-left: 10;
`;

export const Sendbutton = styled(Image)`
    width: 56;
    height: 56;
    resize: 'contain';
    margin-left: 10;
    align-self: flex-end;
    margin: 0 4px;
`

export const IconDiv = styled(View)`
 display: flex;
 flex-direction: column;
 background: #F4F9FF;
 padding : 12px 16px;
`
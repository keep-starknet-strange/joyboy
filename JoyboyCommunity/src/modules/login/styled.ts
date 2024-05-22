import {Image, Pressable, Text as RNText, TextInput, View} from 'react-native';
import styled from 'styled-components/native';

import {ScreenContainer} from '../../components';

export const ImportButton = styled(Pressable)`
  padding: 8px 24px;
  border-color: black;
  color: white;
  border-radius: 8px;
`;

export const CreateAccountButton = styled(Pressable)`
  border-radius: 8px;
  padding: 8px 24px;
  border-color: black;
  border: 1px;
  color: white;
`;

export const LoginButton = styled(Pressable)`
  border-radius: 8px;
  border: 1px;
  background-color: gray;
  padding: 8px 24px;
  color: white;
`;

export const SkipButton = styled(Pressable)`
  border-radius: 8px;
  padding: 8px 24px;
  border-color: black;
  color: white;
`;

export const Container = styled(ScreenContainer)`
  justify-content: center;
  align-items: center;
  gap: 1;
`;

export const Logo = styled(Image)`
  width: 200px;
  height: 200px;
`;

export const InputContainer = styled(View)`
  margin-vertical: 10;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
`;

export const FormContainer = styled(View)`
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
`;

export const Input = styled(TextInput)<{$focused?: boolean}>`
  min-height: 40px;
  border-color: #ccc;
  border-width: 1px;
  border-radius: 5px;
  padding-horizontal: 10px;
  background-color: #fff;
  color: #000;
  font-size: 16px;
  /* Shadow for better visibility */
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 1px;
  }
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  elevation: 2;
  margin-vertical: 4px;

  ${({$focused}) => $focused && `border-color: #007AFF;`}
`;

export const Text = styled(RNText)`
  width: 100%;
  color: white;
`;

import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable,} from 'react-native';
import styled from 'styled-components/native';
import {RootStackNavigationProps} from '../../../types';
import AddPostIcon from '../../../assets/feed/add';

const Button = styled(Pressable)`
  display: flex;
  justify-content: center;
  align-items: center;
  position:  relative;
`;

export default function FloatingPostButton() {
  const navigation = useNavigation<RootStackNavigationProps>();

  const handleNavigation = () => {
    navigation.push('CreatePost');
  };

  return (
    <Button onPress={handleNavigation}>
      <AddPostIcon />
    </Button>
  );
}

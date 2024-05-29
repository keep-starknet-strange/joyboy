import {useNavigation} from '@react-navigation/native';
import {Pressable} from 'react-native';
import styled from 'styled-components/native';

import {AddPostIcon} from '../../../assets/icons';
import {MainStackNavigationProps} from '../../../types';

const Button = styled(Pressable)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export default function FloatingPostButton() {
  const navigation = useNavigation<MainStackNavigationProps>();

  const handleNavigation = () => {
    navigation.push('CreatePost');
  };

  return (
    <Button onPress={handleNavigation}>
      <AddPostIcon width={72} height={72} color="#EC796B" />
    </Button>
  );
}

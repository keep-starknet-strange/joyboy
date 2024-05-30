import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';

import {MainStackNavigationProps} from '../../types';
import {AvatarImage} from './styled';

export type AvatarProps = {
  userId: string;
  source?: string;
};

export const Avatar: React.FC<AvatarProps> = ({source, userId}) => {
  const navigation = useNavigation<MainStackNavigationProps>();

  const handleProfilePress = () => {
    navigation.push('Profile', {publicKey: userId});
  };

  return (
    <TouchableOpacity onPress={handleProfilePress}>
      <AvatarImage source={source ?? require('../../../assets/joyboy-logo.png')} />
    </TouchableOpacity>
  );
};

export {AvatarImage};

import {Button, Text, View} from 'react-native';

import {AvatarImage} from '../../../components';
import {NotificationImage, NotificationLayout} from './styled';
import { useNavigation } from '@react-navigation/native';
import { MainStackNavigationProps } from '../../../types';
export type NotificationProps = {
  post: {
    id?: string;
    content: string;
    username?: string;
    image?: string;
    author?: string;
  };
};

export const Notification: React.FC<NotificationProps> = ({post}) => {
  const navigator =  useNavigation<MainStackNavigationProps>()
  const Dialogpage=()=>{
    navigator.push('DialogPage')
  }
  return (
    <NotificationLayout>
      <View style={{flex: 1}}>
        <AvatarImage source={require('../../../../assets/joyboy-logo.png')} />
      </View>

      <View style={{gap: 4, flex: 9}}>
        <Text style={{color: 'black', fontWeight: '700'}}>{post?.author}</Text>

        <Text style={{color: 'black'}}>{post.content}</Text>

        {post.image && <NotificationImage source={{uri: post.image}} />}
      </View>
      <View>
      </View>
    </NotificationLayout>
  );
};

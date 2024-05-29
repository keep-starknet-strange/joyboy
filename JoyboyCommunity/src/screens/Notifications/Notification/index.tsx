import {Text, View} from 'react-native';

import {AvatarImage} from '../../../components';
import {NotificationImage, NotificationLayout} from './styled';

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
    </NotificationLayout>
  );
};

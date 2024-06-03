import {Image, View} from 'react-native';

import {Text} from '../../../components';
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
        <Image
          style={{width: 44, height: 44}}
          source={require('../../../../assets/joyboy-logo.png')}
        />
      </View>

      <View style={{gap: 4, flex: 9}}>
        <Text weight="bold" style={{color: 'black'}}>
          {post?.author}
        </Text>

        <Text style={{color: 'black'}}>{post.content}</Text>

        {post.image && <NotificationImage source={{uri: post.image}} />}
      </View>
    </NotificationLayout>
  );
};

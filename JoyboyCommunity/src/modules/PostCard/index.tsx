import {NDKEvent} from '@nostr-dev-kit/ndk';
import {View} from 'react-native';

import {useStyles} from '../../hooks';
import {Post} from '../Post';
import stylesheet from './styles';

export type PostCardProps = {
  event?: NDKEvent;
};

export const PostCard: React.FC<PostCardProps> = ({event}) => {
  const styles = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Post event={event} />
    </View>
  );
};

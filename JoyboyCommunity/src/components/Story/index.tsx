import {Image, ImageSourcePropType, View} from 'react-native';

import {Text} from '../Text';
import styles from './styles';

export type StoryProps = {
  image: ImageSourcePropType;
  name: string;
};

export const Story: React.FC<StoryProps> = ({image, name}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/feed/images/story-bg.png')} resizeMode="cover" />
        <Image style={styles.image} source={image} resizeMode="cover" />
      </View>

      <Text weight="medium" fontSize={13} style={styles.name}>
        {name}
      </Text>
    </View>
  );
};

import {Image, ImageProps, StyleSheet, View} from 'react-native';

export type AvatarProps = ImageProps & {
  size?: number;
};

export const Avatar: React.FC<AvatarProps> = ({size, source}) => {
  return (
    <View style={[{width: size, height: size}, styles.container]}>
      <Image source={source} style={{width: size, height: size}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 99,
    overflow: 'hidden',
  },
});

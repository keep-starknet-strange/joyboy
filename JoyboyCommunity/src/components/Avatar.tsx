import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

export const Avatar = ({ navigation, source }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <Image
        source={{ uri: source?? 'https://your-avatar-url.com/image.jpg' }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
    </TouchableOpacity>
  );
};

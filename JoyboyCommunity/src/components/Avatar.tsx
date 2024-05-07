import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

export const Avatar = ({ navigation, source }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <Image
        // source={{ uri:  "@expo/snack-static/joyboy-logo.png" }}
        source={source ?? require('../../assets/joyboy-logo.png')}

        // source={{ uri:  "@expo/snack-static/react-native-logo.png" }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
    </TouchableOpacity>
  );
};

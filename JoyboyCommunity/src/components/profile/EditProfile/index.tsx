import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Button, TouchableOpacity, View} from 'react-native';

import {IProfileNostr} from '../../../types';
import {HomeNavigationProp} from '../../../types';
import {Input} from './styled';

export const EditProfile: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();

  const [text, setText] = useState('');
  const [profile, setProfile] = useState<IProfileNostr | undefined>({});

  const onSubmit = (text?: string) => {};

  const handleChangeText = (inputText: string) => {
    setText(inputText);
  };

  const handleSubmit = () => {
    onSubmit(text);
    setText(''); // Clear the input after submitting
  };

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
        <Input value={text} onChangeText={handleChangeText} placeholder="Enter your handle..." />

        <Input value={text} onChangeText={handleChangeText} placeholder="Bio of your profile" />
      </TouchableOpacity>

      <Button title="Edit Profile" onPress={() => console.log('Edit profile')} />
    </View>
  );
};

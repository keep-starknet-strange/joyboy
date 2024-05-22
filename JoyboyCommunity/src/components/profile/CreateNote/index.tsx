import React, {useState} from 'react';
import {Button, View} from 'react-native';

import {IPostNote} from '../../../types/index';
import {Input} from './styled';

export const CreateNote: React.FC = () => {
  const [text, setText] = useState('');
  const [post, setPost] = useState<IPostNote | undefined>({
    content: undefined,
  });

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
      <Input
        multiline
        value={text}
        onChangeText={handleChangeText}
        placeholder="Write your note here"
      />

      <Button title="Create note" onPress={handleSubmit} />
    </View>
  );
};

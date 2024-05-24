import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Pressable, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

import {Divider, KeyboardAvoidingView, Typography} from '../../components';
import {useNostr} from '../../hooks/useNostr';
import {useAuth} from '../../store/auth';
import {Container, Photo, PostButton, TitleContainer} from './styled';

export default function CreatePost() {
  const navigation = useNavigation();

  const {privateKey} = useAuth();
  const {sendNote} = useNostr();
  const [note, setNote] = useState<string | undefined>();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const handlePostNote = useCallback(async () => {
    try {
      console.log('handle send note');
      // do something on post
      if (!note || note?.length == 0) {
        alert('Write your note');
        return;
      }
      alert('Note sending, please wait.');

      if (!privateKey) {
        alert('Please login before send a note');
        return;
      }

      /** @TODO handle tags NIP-10  */
      const noteEvent = sendNote(privateKey, note);
      console.log('noteEvent', noteEvent);
      if (noteEvent?.isValid) {
        alert('Note send');
      }
    } catch (e) {
      console.log('Error send note', e);
    }
  }, [note]);
  const isCreateDisabled = note && note?.length > 0 ? false : true;

  return (
    <KeyboardAvoidingView>
      <Container>
        <Pressable onPress={handleGoBack}>
          <Typography variant="ts15r">Cancel</Typography>
        </Pressable>

        <PostButton onPress={handlePostNote} disabled={isCreateDisabled}>
          <Typography variant="ts15r">Post</Typography>
        </PostButton>
      </Container>

      <View style={{marginBottom: 12}}>
        <Divider />
      </View>

      <TitleContainer>
        <Photo source={{uri: 'https://picsum.photos/201/300'}} />
        <TextInput
          autoFocus
          multiline={true}
          value={note}
          placeholder="Title"
          onChangeText={setNote}
        />
      </TitleContainer>
    </KeyboardAvoidingView>
  );
}

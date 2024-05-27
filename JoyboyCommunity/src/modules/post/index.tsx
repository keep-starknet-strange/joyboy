import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Image, Pressable, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

import {Divider, KeyboardAvoidingView, Typography} from '../../components';
import {useNostr} from '../../hooks/useNostr';
import {useAuth} from '../../store/auth';
import {Container, Photo, PostButton, TitleContainer,Icons, IconContainer, Sendbutton, IconDiv} from './styled';

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
          <Typography  style={{color:'#4B799F', fontSize: 17  }} variant="ts15r">Cancel</Typography>
        </Pressable>

        <PostButton onPress={handlePostNote} disabled={isCreateDisabled}>
          <Typography  style={{color:'#4B799F', fontSize: 17}} variant="ts15r">Draft</Typography>
        </PostButton>
      </Container>

      <View style={{marginBottom: 1}}>
        <Divider />
      </View>

      <TitleContainer>
        <Photo source={require('../../../assets/profile.png')} />
        <TextInput
          style={{flex: 1, paddingTop: 10, paddingBottom: 10, fontSize: 16, lineHeight: 20}}
          autoFocus
          multiline={true}
          value={note}
          placeholder="Make a post"
          onChangeText={setNote}
        />
      </TitleContainer>

      <IconDiv >
    <Sendbutton source={require('../../../assets/Post1.png')}/>
      <IconContainer>
  <TouchableOpacity>
           <Icons source={require('../../../assets/image-02.png')} />
       </TouchableOpacity>

          <TouchableOpacity>
           <Icons source={require('../../../assets/gif-02.png')} />
       </TouchableOpacity>

          <TouchableOpacity>
           <Icons source={require('../../../assets/sticky-note-02.png')} />
       </TouchableOpacity>
      </IconContainer>
     
      </IconDiv>
    </KeyboardAvoidingView>
  );
}

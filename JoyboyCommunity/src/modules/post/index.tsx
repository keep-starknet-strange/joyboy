import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

import CopyIcon from '../../../assets/svgs/svgComponents/Copy';
import Gallery from '../../../assets/svgs/svgComponents/Gallery';
import GifIcon from '../../../assets/svgs/svgComponents/Gif';
import ProfileIcon from '../../../assets/svgs/svgComponents/Profile';
import SendButton from '../../../assets/svgs/svgComponents/SendButton';
import {Divider, KeyboardAvoidingView, Typography} from '../../components';
import {useSendNote} from '../../hooks/useNostr';
import {useAuth} from '../../store/auth';
import {
  Container,
  IconContainer,
  IconDiv,
  Photo,
  PostButton,
  SendbuttonContainer,
  TitleContainer,
} from './styled';

export default function CreatePost() {
  const navigation = useNavigation();

  const sendNote = useSendNote();
  const {privateKey} = useAuth();
  const [note, setNote] = useState<string | undefined>();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const handlePostNoteFn = () => {
    if (!note || note?.length == 0) {
      alert('Write your note');
      return;
    }
    alert('Note sending, please wait.');

    if (!privateKey) {
      alert('Please login before send a note');
      return;
    }

    sendNote.mutate(
      {sk: privateKey, content: note},
      {
        onSuccess(data) {
          if (data.isValid) {
            alert('Note sent');
          }
        },
        onError(error) {
          console.log('Error send note', error);
        },
      },
    );
  };

  const isCreateDisabled = note && note?.length > 0 ? false : true;

  return (
    <KeyboardAvoidingView>
      <Container>
        <Pressable onPress={handleGoBack}>
          <Typography style={{color: '#4B799F', fontSize: 17}} variant="ts15r">
            Cancel
          </Typography>
        </Pressable>

        <PostButton onPress={handlePostNoteFn} disabled={isCreateDisabled}>
          <Typography style={{color: '#4B799F', fontSize: 17}} variant="ts15r">
            Draft
          </Typography>
        </PostButton>
      </Container>

      <View style={{marginBottom: 1}}>
        <Divider />
      </View>

      <TitleContainer>
        <Photo>
          <ProfileIcon />
        </Photo>
        <TextInput
          style={{flex: 1, paddingTop: 10, paddingBottom: 10, fontSize: 16, lineHeight: 20}}
          autoFocus
          multiline={true}
          value={note}
          placeholder="Make a post"
          onChangeText={setNote}
        />
      </TitleContainer>

      <IconDiv>
        <SendbuttonContainer>
          <SendButton width="56" height="56" />
        </SendbuttonContainer>
        <IconContainer>
          <TouchableOpacity>
            <Gallery width="24" height="24" strokeWidth={1.5} stroke="#4B799F" />
          </TouchableOpacity>

          <TouchableOpacity>
            <GifIcon width="24" height="24" strokeWidth={1.5} stroke="#4B799F" />
          </TouchableOpacity>

          <TouchableOpacity>
            <CopyIcon width="24" height="24" strokeWidth={1.5} stroke="#4B799F" />
          </TouchableOpacity>
        </IconContainer>
      </IconDiv>
    </KeyboardAvoidingView>
  );
}

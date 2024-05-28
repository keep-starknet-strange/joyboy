import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

import {Divider, KeyboardAvoidingView, Typography} from '../../components';
import {useNostr} from '../../hooks/useNostr';
import {useAuth} from '../../store/auth';
import Svg, { G, Path } from 'react-native-svg';
import Gallery from '../../../assets/svgs/svgComponents/Gallery';
import SendButton from '../../../assets/svgs/svgComponents/SendButton';
import GifIcon from '../../../assets/svgs/svgComponents/Gif';
import CopyIcon from '../../../assets/svgs/svgComponents/Copy';
import ProfileIcon from '../../../assets/svgs/svgComponents/Profile';
import {
  Container,
  Photo,
  PostButton,
  TitleContainer,
  Icons,
  IconContainer,
  IconDiv,
  SendbuttonContainer,
} from './styled';




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
          <Typography style={{color: '#4B799F', fontSize: 17}} variant="ts15r">
            Cancel
          </Typography>
        </Pressable>

        <PostButton onPress={handlePostNote} disabled={isCreateDisabled}>
          <Typography style={{color: '#4B799F', fontSize: 17}} variant="ts15r">
            Draft
          </Typography>
        </PostButton>
      </Container>

      <View style={{marginBottom: 1}}>
        <Divider />
      </View>

      <TitleContainer>
        <Photo><ProfileIcon /></Photo>
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

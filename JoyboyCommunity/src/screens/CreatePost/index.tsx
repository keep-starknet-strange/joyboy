import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {Pressable, TextInput, TouchableOpacity, View} from 'react-native';

import {CopyIcon, GalleryIcon, GifIcon, SendIcon, UserIcon} from '../../assets/icons';
import {Divider, KeyboardAvoidingView, Text} from '../../components';
import {useSendNote} from '../../hooks';
import {useAuth} from '../../store/auth';
import {
  Container,
  IconContainer,
  IconDiv,
  Photo,
  SendbuttonContainer,
  TitleContainer,
} from './styled';

export const CreatePost: React.FC = () => {
  const navigation = useNavigation();

  const sendNote = useSendNote();
  const {privateKey} = useAuth();
  const [note, setNote] = useState<string | undefined>();

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
      {content: note},
      {
        onSuccess(data) {
          if (data) {
            alert('Note sent');
          }
        },
        onError(error) {
          console.log('Error send note', error);
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView>
      <Container>
        <Pressable onPress={navigation.goBack}>
          <Text color="textLight" fontSize={17}>
            Cancel
          </Text>
        </Pressable>
      </Container>

      <View style={{marginBottom: 1}}>
        <Divider />
      </View>

      <TitleContainer>
        <Photo>
          <UserIcon width={32} height={32} color="#1E2F3D" />
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
          <SendIcon width="56" height="56" color="#EC796B" />
        </SendbuttonContainer>
        <IconContainer>
          <TouchableOpacity>
            <GalleryIcon width="24" height="24" color="#4B799F" />
          </TouchableOpacity>

          <TouchableOpacity>
            <GifIcon width="24" height="24" color="#4B799F" />
          </TouchableOpacity>

          <TouchableOpacity>
            <CopyIcon width="24" height="24" color="#4B799F" />
          </TouchableOpacity>
        </IconContainer>
      </IconDiv>
    </KeyboardAvoidingView>
  );
};

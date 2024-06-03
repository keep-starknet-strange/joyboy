import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {KeyboardAvoidingView, Pressable, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {CopyIcon, GalleryIcon, GifIcon, SendIcon} from '../../assets/icons';
import {TextButton} from '../../components';
import {useSendNote, useStyles, useTheme} from '../../hooks';
import {useAuth} from '../../store/auth';
import stylesheet from './styles';

export const CreatePost: React.FC = () => {
  const navigation = useNavigation();

  const theme = useTheme();
  const styles = useStyles(stylesheet);

  const sendNote = useSendNote();
  const {privateKey} = useAuth();
  const [note, setNote] = useState<string | undefined>();

  const handleSendNote = () => {
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
    <View style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
        <TextButton style={styles.cancelButton} onPress={navigation.goBack}>
          Cancel
        </TextButton>
      </SafeAreaView>

      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.content}>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            autoFocus
            multiline={true}
            placeholder="Make a post"
            placeholderTextColor={theme.colors.inputPlaceholder}
          />

          <View style={styles.buttons}>
            <View style={styles.mediaButtons}>
              <Pressable>
                <GalleryIcon width="24" height="24" color={theme.colors.primary} />
              </Pressable>

              <Pressable>
                <GifIcon width="24" height="24" color={theme.colors.primary} />
              </Pressable>

              <Pressable>
                <CopyIcon width="24" height="24" color={theme.colors.primary} />
              </Pressable>
            </View>

            <Pressable style={styles.sendButton} onPress={handleSendNote}>
              <SendIcon width="56" height="56" color={theme.colors.primary} />
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

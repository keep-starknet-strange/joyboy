import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {KeyboardAvoidingView, Pressable, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {CopyIcon, GalleryIcon, GifIcon, SendIcon} from '../../assets/icons';
import {TextButton} from '../../components';
import {useSendNote, useStyles, useTheme, useToast} from '../../hooks';
import stylesheet from './styles';

export const CreatePost: React.FC = () => {
  const navigation = useNavigation();

  const theme = useTheme();
  const styles = useStyles(stylesheet);

  const [note, setNote] = useState<string | undefined>();
  const sendNote = useSendNote();
  const {showToast} = useToast();

  const handleSendNote = () => {
    if (!note || note?.length == 0) {
      showToast({type: 'error', title: 'Please write your note'});
      return;
    }

    sendNote.mutate(
      {content: note},
      {
        onSuccess() {
          showToast({type: 'success', title: 'Note sent successfully'});
        },
        onError() {
          showToast({
            type: 'error',
            title: 'Error! Note could not be sent. Please try again later.',
          });
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

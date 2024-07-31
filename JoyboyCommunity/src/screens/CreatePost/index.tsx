import {useQueryClient} from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import {useState} from 'react';
import {Image, KeyboardAvoidingView, Pressable, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {GalleryIcon, SendIconContained} from '../../assets/icons';
import {TextButton} from '../../components';
import {useSendNote, useStyles, useTheme} from '../../hooks';
import {useFileUpload} from '../../hooks/api';
import {useToast} from '../../hooks/modals';
import {CreatePostScreenProps} from '../../types';
import {getImageRatio} from '../../utils/helpers';
import stylesheet from './styles';

export const CreatePost: React.FC<CreatePostScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const styles = useStyles(stylesheet);

  const [note, setNote] = useState<string | undefined>();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>();

  const fileUpload = useFileUpload();
  const sendNote = useSendNote();
  const queryClient = useQueryClient();
  const {showToast} = useToast();

  const onGalleryPress = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      selectionLimit: 1,
      exif: false,
      quality: 0.75,
    });

    if (pickerResult.canceled || !pickerResult.assets.length) return;
    setImage(pickerResult.assets[0]);
  };

  const handleSendNote = async () => {
    if (!note || note?.trim().length == 0) {
      showToast({type: 'error', title: 'Please write your note'});
      return;
    }

    let imageUrl: string | undefined;
    if (image) {
      const result = await fileUpload.mutateAsync(image);
      if (result.data.url) imageUrl = result.data.url;
    }

    sendNote.mutate(
      {
        content: note,
        tags: image && imageUrl ? [['image', imageUrl, `${image.width}x${image.height}`]] : [],
      },
      {
        onSuccess() {
          showToast({type: 'success', title: 'Note sent successfully'});
          queryClient.invalidateQueries({queryKey: ['rootNotes']});
          navigation.goBack();
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
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              autoFocus
              multiline={true}
              placeholder="Make a post"
              placeholderTextColor={theme.colors.inputPlaceholder}
            />

            {image && (
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: image.uri}}
                  style={[styles.image, {aspectRatio: getImageRatio(image.width, image.height)}]}
                />
              </View>
            )}
          </View>

          <View style={styles.buttons}>
            <View style={styles.mediaButtons}>
              <Pressable onPress={onGalleryPress}>
                <GalleryIcon width="24" height="24" color={theme.colors.primary} />
              </Pressable>
            </View>

            <Pressable style={styles.sendButton} onPress={handleSendNote}>
              <SendIconContained width="56" height="56" color={theme.colors.primary} />
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

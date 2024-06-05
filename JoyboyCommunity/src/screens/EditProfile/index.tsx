import {useQueryClient} from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import {Formik, FormikProps} from 'formik';
import {useRef} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';

import {CopyIconStack} from '../../assets/icons';
import {Button, SquareInput, Text} from '../../components';
import {useEditProfile, useProfile, useStyles, useTheme} from '../../hooks';
import {useAuth} from '../../store/auth';
import {EditProfileScreenProps} from '../../types';
import {ProfileHead} from '../Profile/Head';
import stylesheet from './styles';

const UsernameInputLeft = (
  <Text weight="bold" color="inputPlaceholder">
    @
  </Text>
);

type FormValues = {
  username: string;
  displayName: string;
  bio: string;
  telegram: string;
  github: string;
  twitter: string;
};

export const EditProfile: React.FC<EditProfileScreenProps> = () => {
  const formikRef = useRef<FormikProps<FormValues>>(null);

  const theme = useTheme();
  const styles = useStyles(stylesheet);

  const publicKey = useAuth((state) => state.publicKey);
  const profile = useProfile({publicKey});
  const editProfile = useEditProfile();
  const queryClient = useQueryClient();

  const onPublicKeyCopyPress = async () => {
    await Clipboard.setStringAsync(publicKey);
    alert('Copied to clipboard');
  };

  if (profile.isLoading || !profile.data) return null;

  const initialFormValues: FormValues = {
    username: profile.data.nip05,
    displayName: profile.data.displayName ?? profile.data.name,
    bio: profile.data.about,
    telegram: profile.data.telegram?.toString(),
    github: profile.data.github?.toString(),
    twitter: profile.data.twitter?.toString(),
  };

  const onSubmitPress = () => {
    formikRef.current?.handleSubmit();
  };

  const validateForm = (values: FormValues) => {
    const errors = {} as Partial<FormValues>;

    // TODO: Do validation

    return errors;
  };

  const onFormSubmit = async (values: FormValues) => {
    await editProfile.mutateAsync({
      nip05: values.username,
      displayName: values.displayName,
      about: values.bio,
      telegram: values.telegram,
      github: values.github,
      twitter: values.twitter,
    });

    queryClient.invalidateQueries({queryKey: ['profile', publicKey]});

    alert('Profile updated');
  };

  return (
    <ScrollView automaticallyAdjustKeyboardInsets style={styles.container}>
      <ProfileHead
        profilePhoto={profile.data.image && {uri: profile.data.image}}
        coverPhoto={profile.data.banner && {uri: profile.data.banner}}
        buttons={
          <Button variant="secondary" small onPress={onSubmitPress}>
            Save
          </Button>
        }
      />

      <Formik
        innerRef={formikRef}
        initialValues={initialFormValues}
        onSubmit={onFormSubmit}
        validate={validateForm}
      >
        {({handleChange, handleBlur, values, errors}) => (
          <View style={styles.form}>
            <SquareInput
              placeholder="username"
              left={UsernameInputLeft}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              error={errors.username}
            />

            <SquareInput
              placeholder="Display Name"
              onChangeText={handleChange('displayName')}
              onBlur={handleBlur('displayName')}
              value={values.displayName}
              error={errors.displayName}
            />

            <SquareInput
              readOnly
              editable={false}
              value={publicKey}
              left={
                <TouchableOpacity onPress={onPublicKeyCopyPress}>
                  <CopyIconStack color={theme.colors.primary} />
                </TouchableOpacity>
              }
              inputStyle={styles.publicKeyInput}
            />

            <SquareInput
              placeholder="Bio"
              multiline
              onChangeText={handleChange('bio')}
              onBlur={handleBlur('bio')}
              value={values.bio}
              error={errors.bio}
            />

            <View style={styles.gap} />

            <SquareInput
              placeholder="telegram"
              left={UsernameInputLeft}
              onChangeText={handleChange('telegram')}
              onBlur={handleBlur('telegram')}
              value={values.telegram}
              error={errors.telegram}
            />

            <SquareInput
              placeholder="github"
              left={UsernameInputLeft}
              onChangeText={handleChange('github')}
              onBlur={handleBlur('github')}
              value={values.github}
              error={errors.github}
            />

            <SquareInput
              placeholder="twitter - X"
              left={UsernameInputLeft}
              onChangeText={handleChange('twitter')}
              onBlur={handleBlur('twitter')}
              value={values.twitter}
              error={errors.twitter}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

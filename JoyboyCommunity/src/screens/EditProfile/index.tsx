import * as Clipboard from 'expo-clipboard';
import {ScrollView, TouchableOpacity, View} from 'react-native';

import {CopyIconStack} from '../../assets/icons';
import {Button, SquareInput, Text} from '../../components';
import {useProfile, useStyles, useTheme} from '../../hooks';
import {useAuth} from '../../store/auth';
import {EditProfileScreenProps} from '../../types';
import {ProfileHead} from '../Profile/Head';
import stylesheet from './styles';

const UsernameInputLeft = (
  <Text weight="bold" color="inputPlaceholder">
    @
  </Text>
);

export const EditProfile: React.FC<EditProfileScreenProps> = () => {
  const theme = useTheme();
  const styles = useStyles(stylesheet);

  const publicKey = useAuth((state) => state.publicKey);
  const profile = useProfile({publicKey});

  const onPublicKeyCopyPress = async () => {
    await Clipboard.setStringAsync(publicKey);
    alert('Copied to clipboard');
  };

  if (profile.isLoading || !profile.data) return null;

  return (
    <ScrollView automaticallyAdjustKeyboardInsets style={styles.container}>
      <ProfileHead
        profilePhoto={profile.data.picture && {uri: profile.data.picture}}
        coverPhoto={profile.data.banner && {uri: profile.data.banner}}
        buttons={
          <Button variant="secondary" small>
            Save
          </Button>
        }
      />

      <View style={styles.form}>
        <SquareInput placeholder="username" left={UsernameInputLeft} />

        <SquareInput placeholder="Display Name" />

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

        <SquareInput placeholder="Bio" multiline />

        <View style={styles.gap} />

        <SquareInput placeholder="telegram" left={UsernameInputLeft} />

        <SquareInput placeholder="github" left={UsernameInputLeft} />

        <SquareInput placeholder="twitter - X" left={UsernameInputLeft} />
      </View>
    </ScrollView>
  );
};

import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {Pressable, View} from 'react-native';

import {Button, IconButton, Menu, Text} from '../../../components';
import {useProfile, useStyles, useTheme} from '../../../hooks';
import {useAuth} from '../../../store/auth';
import {ProfileScreenProps} from '../../../types';
import {ProfileHead} from '../Head';
import stylesheet from './styles';

export type ProfileInfoProps = {
  publicKey: string;
};

export const ProfileInfo: React.FC<ProfileInfoProps> = ({publicKey: userPublicKey}) => {
  const theme = useTheme();
  const styles = useStyles(stylesheet);

  const navigation = useNavigation<ProfileScreenProps['navigation']>();

  const {data: profile} = useProfile({publicKey: userPublicKey});

  const [menuOpen, setMenuOpen] = useState(false);
  const publicKey = useAuth((state) => state.publicKey);

  const isSelf = publicKey === userPublicKey;

  const onEditProfilePress = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <View>
      <ProfileHead
        profilePhoto={profile?.image && {uri: profile.image}}
        coverPhoto={profile?.banner && {uri: profile.banner}}
        showSettingsButton={isSelf}
        buttons={
          isSelf ? (
            <>
              <Button
                small
                style={styles.secondaryButton}
                textStyle={styles.secondaryButtonText}
                onPress={onEditProfilePress}
              >
                Edit profile
              </Button>

              <Menu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                handle={
                  <IconButton
                    icon="more-vertical"
                    size={20}
                    style={styles.iconButton}
                    onPress={() => setMenuOpen(true)}
                  />
                }
              >
                <Menu.Item
                  label={profile?.username ? `Share @${profile.username}` : 'Share'}
                  icon="share"
                />
                <Menu.Item label="About" icon="info" />
              </Menu>
            </>
          ) : (
            <>
              <Button
                small
                variant="secondary"
                left={
                  <Feather name="user-plus" size={16} color="white" style={styles.buttonIcon} />
                }
              >
                Connect
              </Button>

              <IconButton icon="message-square" size={20} style={styles.iconButton} />

              <Menu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                handle={
                  <IconButton
                    icon="more-vertical"
                    size={20}
                    style={styles.iconButton}
                    onPress={() => setMenuOpen(true)}
                  />
                }
              >
                <Menu.Item
                  label={profile?.username ? `Tip @${profile.username}` : 'Tip'}
                  icon="dollar-sign"
                />
                <Menu.Item
                  label={profile?.username ? `Share @${profile.username}` : 'Share'}
                  icon="share"
                />
                <Menu.Item label="About" icon="info" />
                <Menu.Item label="Report user" icon="flag" />
              </Menu>
            </>
          )
        }
      />

      <View style={styles.info}>
        <Text weight="bold" fontSize={20} lineHeight={24}>
          {profile?.displayName ?? profile?.name}
        </Text>

        <View style={styles.usernameContainer}>
          {profile?.nip05 ? (
            <Text weight="medium" color="textSecondary" fontSize={16} style={styles.username}>
              @{profile.nip05}
            </Text>
          ) : null}

          <Pressable style={styles.publicKey}>
            <Text
              weight="medium"
              style={styles.publicKeyText}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {userPublicKey}
            </Text>

            <IconButton size={16} icon="copy" color="primary" />
          </Pressable>
        </View>

        {profile?.about ? (
          <Text weight="medium" color="textSecondary" lineHeight={20} style={styles.bio}>
            {profile.about}
          </Text>
        ) : null}

        <View style={styles.connections}>
          <Feather name="user-plus" size={16} color={theme.colors.text} />

          <Text weight="semiBold">13 Connections</Text>
        </View>
      </View>
    </View>
  );
};

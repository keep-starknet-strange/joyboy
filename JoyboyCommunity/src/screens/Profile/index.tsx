import {Feather} from '@expo/vector-icons';
import {Pressable, ScrollView, Text, View} from 'react-native';

import {Button, IconButton, Typography} from '../../components';
import {useAuth} from '../../store/auth';
import {RootStackProfileScreenProps} from '../../types';
import {ProfileHead} from './Head';
import styles from './styles';

export const Profile: React.FC<RootStackProfileScreenProps> = ({route}) => {
  const {publicKey: userPublicKey} = route.params;

  const publicKey = useAuth((state) => state.publicKey);

  const isSelf = publicKey === userPublicKey;

  return (
    <ScrollView>
      <ProfileHead
        showSettingsButton={isSelf}
        buttons={
          isSelf ? (
            <>
              <Button small style={styles.secondaryButton} textStyle={styles.secondaryButtonText}>
                Edit profile
              </Button>

              <IconButton
                icon="more-vertical"
                size={20}
                color="#14142c"
                style={styles.iconButton}
              />
            </>
          ) : (
            <>
              <Button
                small
                left={
                  <Feather name="user-plus" size={16} color="white" style={styles.buttonIcon} />
                }
              >
                Connect
              </Button>

              <IconButton
                icon="message-square"
                size={20}
                style={styles.iconButton}
                color="#14142c"
              />

              <IconButton
                icon="more-vertical"
                size={20}
                style={styles.iconButton}
                color="#14142c"
              />
            </>
          )
        }
      />

      <View style={styles.info}>
        <Typography style={styles.displayName}>Ayushtom</Typography>

        <View style={styles.usernameContainer}>
          <Typography style={styles.username}>@ayushtom</Typography>

          <Pressable style={styles.publicKey}>
            <Text style={styles.publicKeyText} numberOfLines={1} ellipsizeMode="middle">
              npub11234567890abcdeffedcba09876543211234567890abcdeffedcba0987654321
            </Text>

            <IconButton size={16} icon="copy" color="#EC796B" />
          </Pressable>
        </View>

        <Typography style={styles.bio}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis imperdiet urna.
          Phasellus volutpat metus egestas bibendum congue.
        </Typography>

        <View style={styles.connections}>
          <Feather name="user-plus" size={16} color="#14142C" />

          <Typography style={styles.connectionsText}>13 Connections</Typography>
        </View>
      </View>
    </ScrollView>
  );
};

import {Feather} from '@expo/vector-icons';
import {ScrollView} from 'react-native';

import {Button, IconButton} from '../../components';
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
    </ScrollView>
  );
};

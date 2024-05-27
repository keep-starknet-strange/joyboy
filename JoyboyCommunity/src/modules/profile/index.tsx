import {ScrollView} from 'react-native';

import {Button, IconButton} from '../../components';
import {ProfileHead} from './Head';
import styles from './styles';

export default function Profile() {
  return (
    <ScrollView>
      <ProfileHead
        showSettingsButton
        buttons={
          <>
            <Button small style={styles.secondaryButton} textStyle={styles.secondaryButtonText}>
              Edit profile
            </Button>

            <IconButton icon="more-vertical" size={20} style={styles.iconButton} color="#14142c" />
          </>
        }
      />
    </ScrollView>
  );
}

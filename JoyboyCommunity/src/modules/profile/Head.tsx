import {Feather} from '@expo/vector-icons';
import {Image, Pressable, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {IconButton, Typography} from '../../components';
import styles from './styles';

export type ProfileHeadProps = {
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  buttons?: React.ReactNode;
};

export const ProfileHead: React.FC<ProfileHeadProps> = ({
  showBackButton = true,
  showSettingsButton,
  buttons,
}) => {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.coverContainer}>
        <Image source={{uri: 'https://picsum.photos/200/300'}} style={styles.coverImage} />

        {showBackButton && <IconButton icon="chevron-left" size={20} style={styles.backButton} />}

        {showSettingsButton && (
          <Pressable style={styles.settingsButton}>
            <Feather name="settings" size={20} />
            <Typography style={styles.settingsButtonText}>Settings</Typography>
          </Pressable>
        )}
      </SafeAreaView>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Image source={{uri: 'https://picsum.photos/200'}} style={styles.avatarImage} />
        </View>

        <View style={styles.buttons}>{buttons}</View>
      </View>
    </View>
  );
};

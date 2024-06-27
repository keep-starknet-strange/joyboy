import {useNavigation} from '@react-navigation/native';
import {Image, ImageSourcePropType, Pressable, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {SettingsIcon, UploadIcon} from '../../../assets/icons';
import {Avatar, IconButton, Text} from '../../../components';
import {useStyles, useTheme} from '../../../hooks';
import stylesheet, {AVATAR_SIZE} from './styles';

export type ProfileHeadProps = {
  profilePhoto?: ImageSourcePropType;
  coverPhoto?: ImageSourcePropType;
  onCoverPhotoUpload?: () => void;
  onProfilePhotoUpload?: () => void;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  buttons?: React.ReactNode;
};

export const ProfileHead: React.FC<ProfileHeadProps> = ({
  profilePhoto,
  coverPhoto,
  onProfilePhotoUpload,
  onCoverPhotoUpload,
  showBackButton = true,
  showSettingsButton,
  buttons,
}) => {
  const theme = useTheme();
  const styles = useStyles(stylesheet);

  const navigation = useNavigation();

  const goToSettings = () => {
    // navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <View style={styles.coverContainer}>
        <Image
          source={coverPhoto ?? require('../../../assets/joyboy-logo.png')}
          style={styles.coverImage}
        />

        <SafeAreaView edges={['top', 'left', 'right']}>
          <View style={styles.coverButtons}>
            {showBackButton && (
              <IconButton
                icon="chevron-left"
                size={20}
                style={styles.backButton}
                onPress={navigation.goBack}
              />
            )}

            {showSettingsButton && (
              <Pressable style={styles.settingsButton} onPress={goToSettings}>
                <SettingsIcon width={20} height={20} color={theme.colors.text} />
                <Text weight="semiBold" fontSize={14} style={styles.settingsButtonText}>
                  Settings
                </Text>
              </Pressable>
            )}

            {onCoverPhotoUpload && (
              <Pressable style={styles.coverUploadIcon} onPress={onCoverPhotoUpload}>
                <UploadIcon width={44} height={44} color={theme.colors.surface} />
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Avatar
            size={AVATAR_SIZE}
            source={profilePhoto ?? require('../../../assets/joyboy-logo.png')}
          />

          {onProfilePhotoUpload && (
            <Pressable style={styles.avatarUploadIcon} onPress={onProfilePhotoUpload}>
              <UploadIcon width={44} height={44} color={theme.colors.surface} />
            </Pressable>
          )}
        </View>

        <View style={styles.buttons}>{buttons}</View>
      </View>
    </View>
  );
};

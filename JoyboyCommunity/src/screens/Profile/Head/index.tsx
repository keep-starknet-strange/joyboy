import {useNavigation} from '@react-navigation/native';
import {Image, ImageSourcePropType, Pressable, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {SettingsIcon, UploadIcon} from '../../../assets/icons';
import {Avatar, Icon, IconButton, Menu, Text} from '../../../components';
import {useStyles, useTheme} from '../../../hooks';
import stylesheet, {AVATAR_SIZE} from './styles';
import {useState} from 'react';

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
  const {theme, toggleTheme, scheme} = useTheme();
  const styles = useStyles(stylesheet);

  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  const goToSettings = () => {
    setMenuOpen(menuOpen == true ? false : true);
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
                icon="ChevronLeftIcon"
                size={20}
                style={styles.backButton}
                onPress={navigation.goBack}
              />
            )}

            {showSettingsButton && (
              <Menu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                handle={
                  <>
                    <Pressable style={styles.settingsButton} onPress={goToSettings}>
                      <SettingsIcon width={20} height={20} color={theme.colors.text} />
                      <Text weight="semiBold" fontSize={14} style={styles.settingsButtonText}>
                        Settings
                      </Text>
                    </Pressable>
                  </>
                }
              >
                <Menu.Item
                  label="Switch theme"
                  icon={scheme == 'dark' ? 'SunIcon' : 'MoonIcon'}
                  onPress={toggleTheme}
                >
                  {scheme == 'dark' ? (
                    <Icon name="IndicatorIcon" color="primary" size={6} />
                  ) : (
                    <Icon name="IndicatorIcon" color="primary" size={6} />
                  )}
                </Menu.Item>
              </Menu>
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

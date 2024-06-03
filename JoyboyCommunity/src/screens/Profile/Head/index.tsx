import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {Image, ImageSourcePropType, Pressable, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {IconButton, Text} from '../../../components';
import {useStyles} from '../../../hooks';
import stylesheet from './styles';

export type ProfileHeadProps = {
  profilePhoto?: ImageSourcePropType;
  coverPhoto?: ImageSourcePropType;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  buttons?: React.ReactNode;
};

export const ProfileHead: React.FC<ProfileHeadProps> = ({
  profilePhoto,
  coverPhoto,
  showBackButton = true,
  showSettingsButton,
  buttons,
}) => {
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
                <Feather name="settings" size={20} />
                <Text weight="semiBold" fontSize={14} style={styles.settingsButtonText}>
                  Settings
                </Text>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Image
            source={profilePhoto ?? require('../../../assets/joyboy-logo.png')}
            style={styles.avatarImage}
          />
        </View>

        <View style={styles.buttons}>{buttons}</View>
      </View>
    </View>
  );
};

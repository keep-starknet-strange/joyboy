import {Image, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {JoyboyIcon} from '../../assets/icons';
import {useTheme} from '../../hooks';
import {IconButton} from '../iconbutton';
import styles from './styles';

export const Header: React.FC = () => {
  const theme = useTheme();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../../../assets/joyboy-logo.png')} />
          <JoyboyIcon color={theme.colors.text} width={96} height={16} />
        </View>

        <View style={styles.buttons}>
          <IconButton icon="bell" color={theme.colors.text} size={20} />
        </View>
      </View>
    </SafeAreaView>
  );
};

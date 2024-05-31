import {Image, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {JoyboyIcon} from '../../assets/icons';
import {useStyles, useTheme} from '../../hooks';
import {IconButton} from '../IconButton';
import stylesheet from './styles';

export const Header: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles(stylesheet);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../../../assets/joyboy-logo.png')} />

          <JoyboyIcon color={theme.colors.text} width={96} height={16} />
        </View>

        <View style={styles.buttons}>
          <IconButton icon="bell" size={20} />
        </View>
      </View>
    </SafeAreaView>
  );
};

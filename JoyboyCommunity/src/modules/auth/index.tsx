import {Image, View} from 'react-native';

import {Typography} from '../../components';
import styles from './styles';

export type AuthProps = {
  title: string;
  children?: React.ReactNode;
};

export const Auth: React.FC<AuthProps> = ({title, children}) => {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Image
          style={styles.backgroundImage}
          source={require('../../assets/login-background.png')}
        />
      </View>

      <View style={styles.middle}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Image style={styles.logoImage} source={require('../../../assets/joyboy-logo.png')} />
          </View>

          <Typography style={styles.title}>{title}</Typography>
        </View>
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

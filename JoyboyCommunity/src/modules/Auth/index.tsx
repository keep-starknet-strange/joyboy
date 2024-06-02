import {Image, View} from 'react-native';

import {Text} from '../../components';
import {useStyles} from '../../hooks';
import stylesheet from './styles';

export type AuthProps = {
  title: string;
  children?: React.ReactNode;
};

export const Auth: React.FC<AuthProps> = ({title, children}) => {
  const styles = useStyles(stylesheet);

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

          <Text weight="bold" fontSize={22} style={styles.title}>
            {title}
          </Text>
        </View>
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

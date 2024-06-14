import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {ErrorIcon, InfoIcon, SuccessIcon} from '../../assets/icons';
import {useStyles, useTheme} from '../../hooks';
import {Text} from '../Text';
import stylesheet from './styles';

export type ToastProps = {
  type?: 'success' | 'info' | 'error';
};

export const Toast: React.FC<ToastProps> = ({type}) => {
  const theme = useTheme();
  const styles = useStyles(stylesheet);
  const isSent = type === 'success';
  const isInfo = type === 'info';
  const isError = type === 'error';

  return (
    <SafeAreaView>
      <View style={styles.content}>
        {isSent && (
          <View style={styles.sent}>
            <SuccessIcon color={theme.colors.successDark} />
            <Text weight="regular" color="successDark" align="center" fontSize={18}>
              Post sent!
            </Text>
          </View>
        )}

        {isInfo && (
          <View style={styles.info}>
            <InfoIcon color={theme.colors.infoDark} />
            <Text weight="regular" color="infoDark" align="center" fontSize={14}>
              Post will be viewed by followers only
            </Text>
          </View>
        )}

        {isError && (
          <View style={styles.error}>
            <ErrorIcon color={theme.colors.errorDark} />
            <Text weight="regular" color="errorDark" align="center" fontSize={14}>
              Oops! Something went wrong!
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

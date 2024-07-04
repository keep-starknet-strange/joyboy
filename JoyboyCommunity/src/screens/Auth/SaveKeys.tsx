import * as Clipboard from 'expo-clipboard';
import {TouchableOpacity, View} from 'react-native';

import {CopyIconStack} from '../../assets/icons';
import {InfoIcon} from '../../assets/icons';
import {Button, Input, Text} from '../../components';
import {useStyles, useTheme} from '../../hooks';
import {useToast} from '../../hooks/modals';
import {Auth} from '../../modules/Auth';
import {useAuth} from '../../store/auth';
import {AuthSaveKeysScreenProps} from '../../types';
import stylesheet from './styles';

export const SaveKeys: React.FC<AuthSaveKeysScreenProps> = ({route}) => {
  const {privateKey, publicKey} = route.params;

  const theme = useTheme();
  const styles = useStyles(stylesheet);
  const setAuth = useAuth((state) => state.setAuth);
  const {showToast} = useToast();

  const handleCopy = async (type: 'privateKey' | 'publicKey') => {
    await Clipboard.setStringAsync(type === 'privateKey' ? privateKey : publicKey);
    showToast({type: 'info', title: 'Copied to clipboard'});
  };

  const handleContinue = () => {
    setAuth(publicKey, privateKey);
  };

  return (
    <Auth title="Save your keys">
      <View style={styles.inputWithLabel}>
        <Text weight="semiBold" color="textSecondary">
          Your secret key
        </Text>
        <Input
          value={privateKey}
          editable={false}
          right={
            <TouchableOpacity
              onPress={() => handleCopy('privateKey')}
              style={{
                marginRight: 10,
              }}
            >
              <CopyIconStack color={theme.colors.primary} />
            </TouchableOpacity>
          }
        />
      </View>

      <View style={styles.inputWithLabel}>
        <Text weight="semiBold" color="textSecondary">
          Your public key
        </Text>
        <Input
          value={publicKey}
          editable={false}
          right={
            <TouchableOpacity
              onPress={() => handleCopy('publicKey')}
              style={{
                marginRight: 10,
              }}
            >
              <CopyIconStack color={theme.colors.primary} />
            </TouchableOpacity>
          }
        />
      </View>

      <View style={styles.warning}>
        <InfoIcon width={20} height={20} color={theme.colors.primary} />

        <Text color="primary" weight="medium" fontSize={13}>
          Your private key is your password, if you lose this key, you will lose access to your
          account.
        </Text>
      </View>

      <Button block variant="secondary" onPress={handleContinue}>
        Continue
      </Button>
    </Auth>
  );
};

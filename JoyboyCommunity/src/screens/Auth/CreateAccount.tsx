import {canUseBiometricAuthentication} from 'expo-secure-store';
import {useState} from 'react';
import {Platform} from 'react-native';

import {LockIcon} from '../../assets/icons';
import {Button, Input} from '../../components';
import {useDialog, useTheme, useToast} from '../../hooks';
import {Auth} from '../../modules/Auth';
import {AuthCreateAccountScreenProps} from '../../types';
import {generateRandomKeypair} from '../../utils/keypair';
import {storePassword, storePrivateKey, storePublicKey} from '../../utils/storage';

export const CreateAccount: React.FC<AuthCreateAccountScreenProps> = ({navigation}) => {
  const theme = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {showToast} = useToast();
  const {showDialog, hideDialog} = useDialog();

  const handleCreateAccount = async () => {
    if (!password) {
      showToast({type: 'error', title: 'Password is required'});
      return;
    }

    const {privateKey, publicKey} = generateRandomKeypair();

    await storePrivateKey(privateKey, password);
    await storePublicKey(publicKey);

    const biometySupported = Platform.OS !== 'web' && canUseBiometricAuthentication();
    if (biometySupported) {
      showDialog({
        title: 'Easy login',
        description: 'Would you like to use biometrics to login?',
        buttons: [
          {
            type: 'primary',
            label: 'Yes',
            onPress: async () => {
              await storePassword(password);
              hideDialog();
            },
          },
          {
            type: 'default',
            label: 'No',
            onPress: hideDialog,
          },
        ],
      });
    }

    navigation.navigate('SaveKeys', {privateKey, publicKey});
  };

  return (
    <Auth title="Create Account">
      <Input placeholder="@ Username" value={username} onChangeText={setUsername} />

      <Input
        left={<LockIcon color={theme.colors.primary} />}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
      />

      <Button
        block
        variant="secondary"
        disabled={!username || !password}
        onPress={handleCreateAccount}
      >
        Create Account
      </Button>
    </Auth>
  );
};

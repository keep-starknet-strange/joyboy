import {canUseBiometricAuthentication} from 'expo-secure-store';
import {useState} from 'react';
import {Alert} from 'react-native';

import {LockIcon} from '../../assets/icons';
import {Button, Input, TextButton} from '../../components';
import {useTheme} from '../../hooks';
import {Auth} from '../../modules/Auth';
import {AuthCreateAccountScreenProps} from '../../types';
import {generateRandomKeypair} from '../../utils/keypair';
import {storePassword, storePrivateKey, storePublicKey} from '../../utils/storage';

export const CreateAccount: React.FC<AuthCreateAccountScreenProps> = ({navigation}) => {
  const theme = useTheme();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const handleCreateAccount = async () => {
    if (password?.length == 0 || !password) {
      alert('Enter password');
      return;
    }

    const {secretKeyHex, publicKey} = generateRandomKeypair();

    await storePrivateKey(secretKeyHex, password);
    await storePublicKey(publicKey);

    const biometySupported = canUseBiometricAuthentication();
    if (biometySupported) {
      Alert.alert('Easy login', 'Would you like to use biometrics to login?', [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'default',
          onPress: async () => {
            storePassword(password);
          },
        },
      ]);
    }

    navigation.navigate('SaveKeys', {privateKey: secretKeyHex, publicKey});
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

      <TextButton onPress={() => navigation.navigate('Login')}>Login</TextButton>
    </Auth>
  );
};

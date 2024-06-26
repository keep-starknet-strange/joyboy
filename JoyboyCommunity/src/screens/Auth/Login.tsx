import {canUseBiometricAuthentication} from 'expo-secure-store';
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';

import {LockIcon} from '../../assets/icons';
import {Button, Input, TextButton} from '../../components';
import {useTheme, useToast} from '../../hooks';
import {Auth} from '../../modules/Auth';
import {useAuth} from '../../store/auth';
import {AuthLoginScreenProps} from '../../types';
import {getPublicKeyFromSecret} from '../../utils/keypair';
import {
  retrieveAndDecryptPrivateKey,
  retrievePassword,
  retrievePublicKey,
} from '../../utils/storage';

export const Login: React.FC<AuthLoginScreenProps> = ({navigation}) => {
  const theme = useTheme();
  const setAuth = useAuth((state) => state.setAuth);

  const [password, setPassword] = useState(null);
  const {showToast} = useToast();

  useEffect(() => {
    (async () => {
      const biometrySupported = Platform.OS !== 'web' && canUseBiometricAuthentication?.();

      if (biometrySupported) {
        const storedPassword = await retrievePassword();
        if (storedPassword) setPassword(storedPassword);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (password?.length == 0 || !password) {
      showToast({type: 'error', title: 'Password is required'});
      return;
    }

    const privateKey = await retrieveAndDecryptPrivateKey(password);
    if (!privateKey || privateKey.length !== 32) {
      showToast({type: 'error', title: 'Invalid password'});
      return;
    }
    const privateKeyHex = privateKey.toString('hex');

    const storedPublicKey = await retrievePublicKey();
    const publicKey = getPublicKeyFromSecret(privateKeyHex);

    if (publicKey !== storedPublicKey) {
      showToast({type: 'error', title: 'Invalid password'});
      return;
    }

    setAuth(publicKey, privateKeyHex);
  };

  return (
    <Auth title="Login">
      <Input
        left={<LockIcon color={theme.colors.primary} />}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
      />

      <Button block variant="secondary" disabled={!password?.length} onPress={handleLogin}>
        Login
      </Button>

      <TextButton onPress={() => navigation.navigate('CreateAccount')}>Create Account</TextButton>
    </Auth>
  );
};

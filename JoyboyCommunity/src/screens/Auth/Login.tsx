import {canUseBiometricAuthentication} from 'expo-secure-store';
import {useEffect, useState} from 'react';

import {LockIcon} from '../../assets/icons';
import {Button, Input, TextButton} from '../../components';
import {useTheme} from '../../hooks';
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

  useEffect(() => {
    (async () => {
      const biometrySupported = canUseBiometricAuthentication();

      if (biometrySupported) {
        const storedPassword = await retrievePassword();
        if (storedPassword) setPassword(storedPassword);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (password?.length == 0 || !password) {
      alert('Enter password');
      return;
    }

    const secretKey = await retrieveAndDecryptPrivateKey(password);
    if (!secretKey || secretKey.length !== 32) {
      alert('Invalid password');
      return;
    }

    const storedPublicKey = await retrievePublicKey();
    const publicKey = getPublicKeyFromSecret(secretKey);

    if (publicKey !== storedPublicKey) {
      alert('Invalid password');
      return;
    }

    setAuth(publicKey, secretKey);
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

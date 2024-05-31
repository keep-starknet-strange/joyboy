import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {Text} from '../../components';
import {useAuth} from '../../store/auth';
import {useNavigationStore} from '../../store/navigation';
import {generateRandomKeypair, getPublicKeyFromSecret} from '../../utils/keypair';
import {
  retrieveAndDecryptPrivateKey,
  retrievePassword,
  retrievePublicKey,
  storePassword,
  storePrivateKey,
  storePublicKey,
} from '../../utils/storage';
import {
  Container,
  CreateAccountButton,
  ImportButton,
  Input,
  InputContainer,
  LoginButton,
  Logo,
  SkipButton,
} from './styled';

enum LoginStep {
  HOME = 'HOME',
  IMPORT = 'IMPORT',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
}

export default function Login() {
  const setNavigationStack = useNavigationStore((state) => state.setStack);
  const setAuth = useAuth((state) => state.setAuth);

  const [step, setStep] = useState<LoginStep>(LoginStep.HOME);
  const [password, setPassword] = useState<string | undefined>();
  const [privateKeyImport, setImportPrivateKey] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const publicKey = await retrievePublicKey();
      if (!publicKey) setStep(LoginStep.CREATE_ACCOUNT);
    })();
  });

  useEffect(() => {
    (async () => {
      const biometrySupported = SecureStore.canUseBiometricAuthentication();
      if (biometrySupported) {
        const storedPassword = await retrievePassword();

        if (storedPassword) setPassword(storedPassword);
      }
    })();
  }, []);

  /**
   * Create private key
   * Saved it with a password credentials biometrics
   * Add on localstorage
   */
  const handleCreateAccount = async () => {
    if (password?.length == 0 || !password) {
      alert('Enter password');
      return;
    }

    const {secretKey, secretKeyHex, publicKey} = generateRandomKeypair();

    await storePrivateKey(secretKeyHex, password);
    await storePublicKey(publicKey);

    const biometySupported = SecureStore.canUseBiometricAuthentication();
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

    setAuth(publicKey, secretKey);
    setNavigationStack('app');
  };

  /**
   * Import private key
   * Saved it with a password credentials biometrics
   * Add on localstorage
   */
  const handleImportPrivateKey = async () => {
    if (privateKeyImport?.length == 0) {
      alert('Enter a key to import');
      return;
    }
    if (password?.length == 0) {
      alert('Enter a password');
      return;
    }

    const secretKeyHex = privateKeyImport;
    const secretKey = Buffer.from(secretKeyHex, 'hex');
    const publicKey = getPublicKeyFromSecret(secretKey);

    await storePrivateKey(secretKeyHex, password);
    await storePublicKey(publicKey);

    setAuth(publicKey, secretKey);
    setNavigationStack('app');
  };

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
    setNavigationStack('app');
  };

  return (
    <Container>
      <Logo source={require('../../../assets/joyboy-logo.png')} resizeMode="contain" />

      {step == LoginStep.HOME && (
        <InputContainer>
          <Input
            $focused={false}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <ImportButton
            onPress={handleLogin}
            style={{
              paddingVertical: 8,
              width: '100%',
              backgroundColor: 'gray',
            }}
          >
            <Text weight="medium" fontSize={19}>
              Login
            </Text>
          </ImportButton>

          <CreateAccountButton
            onPress={() => setStep(LoginStep.CREATE_ACCOUNT)}
            style={{
              paddingVertical: 8,
              marginVertical: 8,
              width: '100%',
            }}
          >
            <Text weight="medium" fontSize={19}>
              Create an account
            </Text>
          </CreateAccountButton>

          <CreateAccountButton
            onPress={() => setStep(LoginStep.IMPORT)}
            style={{
              paddingVertical: 8,
              marginVertical: 8,
              width: '100%',
            }}
          >
            <Text weight="medium" fontSize={19}>
              Import private key
            </Text>
          </CreateAccountButton>
        </InputContainer>
      )}

      {step == LoginStep.IMPORT && (
        <InputContainer>
          <Input
            $focused={false}
            placeholderTextColor="#888"
            placeholder="Enter your private key"
            value={privateKeyImport}
            onChangeText={setImportPrivateKey}
          />
          <Input
            $focused={false}
            placeholder="Enter a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <ImportButton
            onPress={handleImportPrivateKey}
            style={{
              paddingVertical: 8,
              width: '100%',
              backgroundColor: 'gray',
            }}
          >
            <Text weight="medium" fontSize={19}>
              Import
            </Text>
          </ImportButton>

          <CreateAccountButton
            onPress={() => setStep(LoginStep.CREATE_ACCOUNT)}
            style={{
              paddingVertical: 8,
              marginVertical: 8,
              width: '100%',
            }}
          >
            <Text weight="medium" fontSize={19}>
              Create an account
            </Text>
          </CreateAccountButton>

          <CreateAccountButton
            onPress={() => setStep(LoginStep.HOME)}
            style={{
              paddingVertical: 8,
              marginVertical: 8,
              width: '100%',
            }}
          >
            <Text weight="medium" fontSize={19}>
              Login
            </Text>
          </CreateAccountButton>
        </InputContainer>
      )}

      {step == LoginStep.CREATE_ACCOUNT && (
        <InputContainer>
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <LoginButton
            onPress={handleCreateAccount}
            style={{
              paddingVertical: 8,
              marginVertical: 8,
            }}
          >
            <Text weight="medium" fontSize={19}>
              Create
            </Text>
          </LoginButton>

          <CreateAccountButton
            onPress={() => setStep(LoginStep.HOME)}
            style={{
              paddingVertical: 8,
              marginVertical: 8,
              width: '100%',
            }}
            disabled={privateKeyImport?.length == 0}
          >
            <Text weight="medium" fontSize={19}>
              Try login with an account
            </Text>
          </CreateAccountButton>
        </InputContainer>
      )}

      <SkipButton onPress={() => setNavigationStack('app')}>
        <Text weight="medium" fontSize={19}>
          Skip
        </Text>
      </SkipButton>
    </Container>
  );
}

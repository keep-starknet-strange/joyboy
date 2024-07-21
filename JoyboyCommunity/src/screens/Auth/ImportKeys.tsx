import {NDKPrivateKeySigner} from '@nostr-dev-kit/ndk';
import {canUseBiometricAuthentication} from 'expo-secure-store';
import {useState} from 'react';
import {Platform} from 'react-native';

import {LockIcon} from '../../assets/icons';
import {Button, Input} from '../../components';
import {useNostrContext} from '../../context/NostrContext';
import {useTheme} from '../../hooks';
import {useDialog, useToast} from '../../hooks/modals';
import {Auth} from '../../modules/Auth';
import { AuthImportKeysScreenProps} from '../../types';
import {storePassword, storePrivateKey, storePublicKey} from '../../utils/storage';
import { isValidNostrPrivateKey } from '../../utils/keypair';

export const ImportKeys: React.FC<AuthImportKeysScreenProps> = ({navigation}) => {
  const {theme} = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const {ndk} = useNostrContext();
  const {showToast} = useToast();
  const {showDialog, hideDialog} = useDialog();

  const handleImportAccount = async () => {
    if (!username) {
      showToast({type: 'error', title: 'Username is required'});
      return;
    }

    if (!password) {
      showToast({type: 'error', title: 'Password is required'});
      return;
    }

    if (!privateKey) {
      showToast({type: 'error', title: 'Private key to import is required'});
      return;
    }

    if(!isValidNostrPrivateKey(privateKey)) {
        showToast({type: 'error', title: 'Private key not valid'});
        return;
    }
    await storePrivateKey(privateKey, password);
    ndk.signer = new NDKPrivateKeySigner(privateKey);
    const user = await ndk.signer.user();
    const publicKey= user?.pubkey;
    setPublicKey(publicKey);
    const ndkUser = ndk.getUser({pubkey: user?.pubkey});
    ndkUser.profile = {nip05: username};
    await storePublicKey(publicKey);
    await ndkUser.publish();

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
    <Auth title="Import Account">
      <Input placeholder="@ Username" value={username} onChangeText={setUsername} />

      <Input
        left={<LockIcon color={theme.colors.primary} />}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
      />

      <Input
        left={<LockIcon color={theme.colors.primary} />}
        value={privateKey}
        onChangeText={setPrivateKey}
        secureTextEntry
        placeholder="Private key"
      />

      <Button
        block
        variant="secondary"
        disabled={!username || !password || !privateKey}
        onPress={handleImportAccount}
      >
        Import Account
      </Button>
    </Auth>
  );
};
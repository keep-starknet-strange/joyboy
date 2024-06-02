import {useState} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {CopyIconStack} from '../../assets/icons';
import {InfoIcon} from '../../assets/icons';
import {Button, Input} from '../../components';
import {Auth} from '../../modules/auth';
import {Text} from '../../modules/login/styled';

export const SaveKeys: React.FC = () => {
  const [secretKey, setSecretKey] = useState('nsec65fefewfweehfhewbhvbwehbewhfbewbfhewbfhew');
  const [publicKey, setPublicKey] = useState('nsec65fefewfweehfhewbhvbwehbewhfbewbfhewbfhew');

  const handleCopy = () => {
    // Add your copy functionality here
    console.log('Copied to clipboard:', 'Copied value');
  };

  return (
    <Auth title="Save your keys">
      <Text style={{color: 'rgba(107, 107, 140, 1)', fontWeight: 600, marginLeft: 5}}>
        Your secret key
      </Text>
      <Input
        value={secretKey}
        editable={false}
        right={
          <TouchableOpacity
            onPress={handleCopy}
            style={{
              marginRight: 10,
            }}
          >
            <CopyIconStack color="#EC796B" />
          </TouchableOpacity>
        }
      />

      <Text style={{color: 'rgba(107, 107, 140, 1)', fontWeight: 600, marginLeft: 5}}>
        Your public key
      </Text>
      <Input
        value={publicKey}
        editable={false}
        right={
          <TouchableOpacity
            onPress={handleCopy}
            style={{
              marginRight: 10,
            }}
          >
            <CopyIconStack color="#EC796B" />
          </TouchableOpacity>
        }
      />

      <View
        style={{
          width: 361,
          backgroundColor: 'rgba(236, 121, 107, 0.1)',
          borderRadius: 40,
          paddingHorizontal: 20,
          paddingVertical: 15,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <InfoIcon color="#EC796B" />
        <Text
          style={{
            fontSize: 13,
            color: 'rgba(236, 121, 107, 1)',
            fontWeight: 500,
          }}
        >
          Your private key is your password, if you lose this key, you will lose access to your
          account.
        </Text>
      </View>

      <Button block>Create account</Button>
    </Auth>
  );
};

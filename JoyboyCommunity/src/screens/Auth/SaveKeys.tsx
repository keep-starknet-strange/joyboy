import {View} from 'react-native';
import {Button, Input} from '../../components';
import {Auth} from '../../modules/auth';
import {Text} from '../../modules/login/styled';

export const SaveKeys: React.FC = () => {
  return (
    <Auth title="Save your keys">
      <Input placeholder="Enter your secret key" />
      <Input placeholder="Enter your public key" />

      <View
        style={{
          width: 361,
          height: 56,
          //   opacity: 100,
          backgroundColor: '#EC796B',
          borderRadius: 40,
          paddingTop: 8,
          paddingEnd: 16,
          paddingStart: 16,
          paddingBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: 'white',
          }}
        >
          Your private key is your password, if you lose this key, you will lose access to your
          account.
        </Text>
      </View>

      <Button block disabled>
        Create account
      </Button>
    </Auth>
  );
};

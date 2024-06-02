import {useState} from 'react';

import {LockIcon} from '../../assets/icons';
import {Button, Input, TextButton} from '../../components';
import {Auth} from '../../modules/auth';

export const Login: React.FC = () => {
  const [loginKey, setLoginKey] = useState(null);

  return (
    <Auth title="Login">
      <Input
        left={<LockIcon color="#EC796B" style={{marginLeft: 10}} />}
        placeholder="Enter your login key"
        value={loginKey}
        onChangeText={setLoginKey}
      />

      <Button block disabled={!loginKey?.length}>
        Login
      </Button>

      <TextButton>Create account</TextButton>
    </Auth>
  );
};

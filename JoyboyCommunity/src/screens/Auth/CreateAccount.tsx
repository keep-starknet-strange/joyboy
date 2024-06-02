import {useState} from 'react';

import {Button, Input, TextButton} from '../../components';
import {Auth} from '../../modules/auth';

export const CreateAccount: React.FC = () => {
  const [username, setUsername] = useState(null);
  const [displayname, setDisplayname] = useState(null);

  return (
    <Auth title="Create Account">
      <Input placeholder="@ username" value={username} onChangeText={setUsername} />
      <Input placeholder="Display name" value={displayname} onChangeText={setDisplayname} />

      {username && displayname ? (
        <Button block disabled={!username || !displayname}>
          Continue
        </Button>
      ) : (
        <Button block disabled={!username || !displayname}>
          Create account
        </Button>
      )}

      <TextButton>Login</TextButton>
    </Auth>
  );
};

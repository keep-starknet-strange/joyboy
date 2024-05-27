import {Button, Input, TextButton} from '../../components';
import {Auth} from '../../modules/auth';

export const CreateAccount: React.FC = () => {
  return (
    <Auth title="Create Account">
      <Input placeholder="@ username" />
      <Input placeholder="Display name" />

      <Button block disabled>
        Create account
      </Button>

      <TextButton>Login</TextButton>
    </Auth>
  );
};

import {Button, Input, TextButton} from '../../components';
import {Auth} from '../../modules/auth';

export const Login: React.FC = () => {
  return (
    <Auth title="Login">
      <Input placeholder="Enter your login key" />

      <Button block disabled>
        Login
      </Button>

      <TextButton>Create account</TextButton>
    </Auth>
  );
};

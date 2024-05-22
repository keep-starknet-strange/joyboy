import {View} from 'react-native';
import {styled} from 'styled-components/native';

export const RootScreenContainer = styled(View)`
  flex: 1;
  background-color: ${({theme}) => theme.black[100]};
`;

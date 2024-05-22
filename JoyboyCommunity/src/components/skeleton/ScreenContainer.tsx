import {SafeAreaView} from 'react-native';
import styled from 'styled-components/native';

export const ScreenContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({theme}) => theme.black[100]};
`;

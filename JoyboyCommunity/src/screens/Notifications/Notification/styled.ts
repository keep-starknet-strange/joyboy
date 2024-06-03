import {Image, View} from 'react-native';
import styled from 'styled-components/native';

export const NotificationLayout = styled(View)`
  flex-direction: row;
  gap: 18px;
  padding: 0px 12px;
`;

export const NotificationImage = styled(Image)`
  width: 100%;
  height: 200;
  border-radius: 8px;
  margin-top: 8px;
`;

import {Text, View} from 'react-native';
import styled from 'styled-components/native';

export const Overlay = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const ModalContainer = styled(View)`
  width: 85%;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  background-color: white;
  border-radius: 10px;
  align-items: center;
`;

export const Container = styled(View)`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  margin-bottom: 20px;
`;

export const Title = styled(Text)`
  font-size: 21px;
  font-weight: 700;
  line-height: 24px;
  margin-bottom: 12px;
  margin-top: 12px;
`;
export const IconContainer = styled(View)`
  margin-bottom: 10px;
  margin-top: 16px;
`;

export const Content = styled(Text)`
  font-size: 16px;
  text-align: center;
  color: #8f979e;
`;

export const getButtonColor = (type: string) => {
  switch (type) {
    case 'dangerous':
      return '#0C0C4F';
    case 'primary':
      return '#EC796B';
    case 'secondary':
      return '#0c0c4f1a';
    default:
      return '#ccc';
  }
};

export const getTextColor = (type: string) => {
  switch (type) {
    case 'dangerous':
      return '#ffff';
    case 'primary':
      return '#fff';
    case 'secondary':
      return '#14142C';
  }
};

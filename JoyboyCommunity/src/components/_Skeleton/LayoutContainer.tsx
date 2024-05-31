import {Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styled} from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  background-color: ${({theme}) => theme.black[100]};
`;

const Content = styled(View)<{$top: number}>`
  width: 100%;
  padding: 16px;
  padding-top: ${(props) => props.$top}px;
`;

const Title = styled(Text)`
  font-weight: bold;
  font-size: 18px;
  text-align: center;
`;

export const LayoutContainer = ({title, children}) => {
  const insets = useSafeAreaInsets();

  return (
    <Container style={{flex: 1}}>
      <Content $top={insets.top}>
        <Title>{title}</Title>
      </Content>

      {children}
    </Container>
  );
};

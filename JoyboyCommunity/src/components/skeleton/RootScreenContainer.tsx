import { View } from "react-native";
import { styled } from "styled-components/native";

const RootScreenContainer = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.black[100]};
`;

export default RootScreenContainer;

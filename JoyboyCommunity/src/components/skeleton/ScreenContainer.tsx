import { SafeAreaView, View } from "react-native";
import styled from "styled-components/native";

const ScreenContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.black[100]};
`;

export default ScreenContainer;

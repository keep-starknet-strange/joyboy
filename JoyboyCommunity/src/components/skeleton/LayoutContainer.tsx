import { Text, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styled } from "styled-components/native";

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.black[100]};
`;

const LayoutContainer = ({ title, children }) => {
  // const insets = useSafeAreaInsets();

  return (
    <Container style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          padding: 16,
          // paddingTop: insets.top,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
          {title}
        </Text>
      </View>
      {children}
    </Container>
  );
};

export default LayoutContainer;

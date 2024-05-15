import { View, Text, Pressable, SafeAreaView } from "react-native";
import React from "react";
import useAuth from "../../hooks/useAuth";
import ScreenContainer from "../../components/skeleton/ScreenContainer";
import styled, { useTheme } from "styled-components/native";
import Typography from "../../components/typography";

const LoginButton = styled(Pressable)`
  background-color: black;
  border-radius: 8px;
  padding: 8px 24px;
`;

export default function Login() {
  const { login } = useAuth();
  const theme = useTheme();
  return (
    <ScreenContainer style={{ justifyContent: "center", alignItems: "center" }}>
      <LoginButton onPress={login}>
        <Typography variant="ts19m" colorCode={theme.black[100]}>
          Login
        </Typography>
      </LoginButton>
    </ScreenContainer>
  );
}

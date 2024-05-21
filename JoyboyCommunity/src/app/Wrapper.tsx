import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Host as PortalizeProvider } from "react-native-portalize";
import { ThemeProvider } from "styled-components/native";
import { RootScreenContainer } from "../components";
import { darkModeColors, lightModeColors } from "../tokens/colors";
import App from "./App";

export const Wrapper: React.FC = () => {
  const colorScheme = useColorScheme();

  const [theme, setTheme] = useState<
    typeof darkModeColors | typeof lightModeColors
  >(lightModeColors);

  useEffect(() => {
    // TODO: uncomment when we want to apply themeing
    // setTheme(colorScheme === "light" ? lightModeColors : darkModeColors);
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <PortalizeProvider>
          <RootScreenContainer>
            <App />
          </RootScreenContainer>
        </PortalizeProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

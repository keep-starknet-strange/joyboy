import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import App from "../../App";
import { useColorScheme } from "react-native";
import { ThemeProvider } from "styled-components/native";
import { darkModeColors, lightModeColors } from "../tokens/colors";

export default function Wrapper() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<
    typeof darkModeColors | typeof lightModeColors
  >(darkModeColors);

  useEffect(() => {
    if (colorScheme === "light") {
      setTheme(lightModeColors);
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <React.Fragment>
          <App />
        </React.Fragment>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

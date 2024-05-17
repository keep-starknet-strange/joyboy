import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect } from "react";
import App from "../../App";
import { useColorScheme } from "react-native";
import { ThemeProvider } from "styled-components/native";
import { darkModeColors, lightModeColors } from "../tokens/colors";

export default function Wrapper() {
  const colorScheme = useColorScheme();

  // change the state value to dark mode colors when we want to apply themeing
  const [theme, setTheme] = React.useState<
    typeof darkModeColors | typeof lightModeColors
  >(lightModeColors);

  useEffect(() => {
    if (colorScheme === "light") {
      setTheme(lightModeColors);
    }
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <App />
        </React.Fragment>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

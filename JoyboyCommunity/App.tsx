// App.js

import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./src/screens/SplashScreen";
import FeedScreen from "./src/screens/FeedScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { useColorScheme } from "react-native";
import DarkModeToggle from "./src/components/DarkModeToggle";
import TopBar from "./src/components/TopBar";
import BottomBar from "./src/components/BottomBar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CustomTabBar } from "./src/components/CustomTabBar";
import { StarknetConfig, argent, braavos, publicProvider, useInjectedConnectors,  } from "@starknet-react/core";
import { mainnet, sepolia } from "@starknet-react/chains";
const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();
function App() {
  const [isReady, setIsReady] = React.useState(true);
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  // const navigation = useNavigation();
  const toggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
  };
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 3000); // Splash screen will be shown for 3 seconds
  }, []);
  const chains = [sepolia, mainnet];
  const provider = publicProvider();
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos(),],
    // Hide recommended connectors if the user has any connector installed.
    // includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random",
  });

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors}>
      <NavigationContainer>
        <Stack.Navigator
        // <Tab.Navigator
        // tabBar={props => <BottomBar {...props} />}
        // tabBar={props => <CustomTabBar {...props} />}
        >
          {isReady ? (
            <>
              <Stack.Screen name="Home" component={FeedScreen} />
              {/* <Stack.Screen name="Feed" component={FeedScreen} /> */}
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          ) : (
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </StarknetConfig>
  );
}

export default App;

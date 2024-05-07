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

  return (
    <NavigationContainer>
   
      <Stack.Navigator
      // <Tab.Navigator
      // tabBar={props => <BottomBar {...props} />}
      // tabBar={props => <CustomTabBar {...props} />}
      >
        {isReady ? (
          <>
            <Stack.Screen name="Home" component={FeedScreen} />
            <Stack.Screen name="Feed" component={FeedScreen} />
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
  );
}

export default App;

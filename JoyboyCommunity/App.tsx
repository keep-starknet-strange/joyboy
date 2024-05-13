// App.js

import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./src/screens/SplashScreen";
import FeedScreen from "./src/screens/FeedScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { Button, Pressable, View, useColorScheme } from "react-native";
import BottomBar from "./src/components/BottomBar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CreatePostScreen from "./src/screens/CreatePostScreen";
import NoteDetailScreen from "./src/screens/NoteDetailScreen";
import UserDetailScreen from "./src/screens/UserDetailScreen";
import { RootStackParamList } from "./src/types";
import { useNostr } from "./src/hooks/useNostr";
const Stack = createStackNavigator<RootStackParamList>();

const HeaderGoBack = ({ navigation }) => {
  return (
    <View>
      <Pressable onPress={() => navigation?.goBack()}></Pressable>
    </View>
  );
};
const Tab = createBottomTabNavigator();
function App() {
  const [isReady, setIsReady] = React.useState(false);
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const toggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
  };
  const { getEvents, getEventsPost, setEvents, events } = useNostr();

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 1500); // Splash screen will be shown for 3 seconds
  }, [isReady, events]);

  useEffect(() => {}, []);

  return (
    <NavigationContainer>
      {/* <Stack.Navigator */}
      <Tab.Navigator
        sceneContainerStyle={{
          backgroundColor: "#022b3a", // Set the default background color for the bottom tab navigator
        }}
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: "#022b3a", // Change the background color of the header
          },

          headerLeft: () => {
            return <HeaderGoBack navigation={navigation} />;
          },
        })}
        tabBar={(props) => <BottomBar {...props} />}
      >
        {isReady ? (
          <>
            <Stack.Screen name="Home" component={FeedScreen} />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerStyle: {
                  backgroundColor: "#022b3a", // Change the background color of the header
                },
              }}
            />
            <Stack.Screen name="Create" component={CreatePostScreen} />
            <Stack.Screen
              name="NoteDetailScreen"
              component={NoteDetailScreen}
            />
            <Stack.Screen
              name="UserDetailScreen"
              component={UserDetailScreen}
            />
          </>
        ) : (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;

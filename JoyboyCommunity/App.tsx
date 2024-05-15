import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { useNostr } from "./src/hooks/useNostr";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RootScreenContainer from "./src/components/skeleton/RootScreenContainer";
import { Host } from "react-native-portalize";
import { useTheme } from "styled-components/native";
import useNavigationStore, { Stacks } from "./src/hooks/useNavigationContext";
import Profile from "./src/modules/profile";
import Feed from "./src/modules/feed";
import Error from "./src/modules/error";
import Login from "./src/modules/login";
import { Ionicons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import Notifications from "./src/modules/notifications";
import CreatePost from "./src/modules/post";

const RootStack = createNativeStackNavigator();
const HomePageBottomTabs = createBottomTabNavigator();

const HomePageBottomTabScreen: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState("Profile");
  const theme = useTheme();

  return (
    <HomePageBottomTabs.Navigator
      sceneContainerStyle={{
        backgroundColor: theme.black[100],
      }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.black[100],
          borderTopColor: "#E4E4E7",
          borderTopWidth: 1,
        },
      }}
    >
      <HomePageBottomTabs.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "grey",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="home" size={24} color="black" />
            ) : (
              <Ionicons name="home-outline" size={24} color="black" />
            ),
        }}
        listeners={({ route }) => ({
          tabPress: () => {
            setCurrentRoute(route.name);
          },
        })}
      />
      <HomePageBottomTabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "grey",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Octicons name="person-fill" size={24} color="black" />
            ) : (
              <Octicons name="person" size={24} color="black" />
            ),
        }}
        listeners={({ route }) => ({
          tabPress: () => {
            setCurrentRoute(route.name);
          },
        })}
      />

      <HomePageBottomTabs.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "grey",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Octicons name="bell-fill" size={24} color="black" />
            ) : (
              <Octicons name="bell" size={24} color="black" />
            ),
        }}
        listeners={({ route }) => ({
          tabPress: () => {
            setCurrentRoute(route.name);
          },
        })}
      />
    </HomePageBottomTabs.Navigator>
  );
};

const AppScreens: React.FC = () => {
  const stack = useNavigationStore((state) => state.stack);
  const theme = useTheme();
  const getCurrentStack = useCallback((): React.ReactNode => {
    switch (stack) {
      case "app":
        return (
          <React.Fragment>
            <RootStack.Screen name="Home" component={HomePageBottomTabScreen} />
            <RootStack.Screen name="CreatePost" component={CreatePost} />
          </React.Fragment>
        );
      case "loading":
        return (
          <React.Fragment>
            <RootStack.Screen name="loading" component={Error} />
          </React.Fragment>
        );

      case "login":
        return (
          <React.Fragment>
            <RootStack.Screen name="Login" component={Login} />
          </React.Fragment>
        );
      default:
        return null;
    }
  }, [stack]);

  return (
    <Host>
      <RootScreenContainer>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.black[100],
            },
          }}
        >
          {getCurrentStack()}
        </RootStack.Navigator>
      </RootScreenContainer>
    </Host>
  );
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const { getEvents, getEventsPost, setEvents, events } = useNostr();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <StatusBar backgroundColor="#15141A" />
        <AppScreens />
      </NavigationContainer>
    </View>
  );
}

import {Ionicons, Octicons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useMemo} from 'react';
import {useTheme} from 'styled-components/native';

import useNavigationStore from '../hooks/useNavigationContext';
import Error from '../modules/error';
import FeedStackScreen from '../modules/feed/FeedStackScreen';
import Login from '../modules/login';
import Notifications from '../modules/notifications';
import CreatePost from '../modules/post';
import Profile from '../modules/profile';
import {NoteDetail} from '../screens/NoteDetail';
import {UserDetail} from '../screens/UserDetail';
import {HomeStackParams, RootStackParams} from '../types';

const RootStack = createNativeStackNavigator<RootStackParams>();
const HomeBottomTabsStack = createBottomTabNavigator<HomeStackParams>();

const HomeBottomTabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <HomeBottomTabsStack.Navigator
      sceneContainerStyle={{
        backgroundColor: theme.black[100],
      }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.black[100],
          borderTopColor: '#E4E4E7',
          borderTopWidth: 1,
        },
      }}
    >
      <HomeBottomTabsStack.Screen
        name="Feed"
        component={FeedStackScreen}
        options={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          tabBarIcon: ({focused}) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color="black" />
          ),
        }}
      />
      <HomeBottomTabsStack.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          tabBarIcon: ({focused}) => (
            <Octicons name={focused ? 'person-fill' : 'person'} size={24} color="black" />
          ),
        }}
      />

      <HomeBottomTabsStack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          tabBarIcon: ({focused}) => (
            <Octicons name={focused ? 'bell-fill' : 'bell'} size={24} color="black" />
          ),
        }}
      />
    </HomeBottomTabsStack.Navigator>
  );
};

const RootNavigator: React.FC = () => {
  const stack = useNavigationStore((state) => state.stack);
  const theme = useTheme();

  const currentStack = useMemo((): React.ReactNode => {
    switch (stack) {
      case 'app':
        return (
          <>
            <RootStack.Screen name="Home" component={HomeBottomTabNavigator} />
            <RootStack.Screen name="CreatePost" component={CreatePost} />
            <RootStack.Screen name="UserDetail" component={UserDetail} />
            <RootStack.Screen name="NoteDetail" component={NoteDetail} />
          </>
        );

      case 'loading':
        return (
          <>
            <RootStack.Screen name="Loading" component={Error} />
          </>
        );

      case 'login':
        return (
          <>
            <RootStack.Screen name="Login" component={Login} />
          </>
        );
      default:
        return null;
    }
  }, [stack]);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.black[100],
        },
      }}
    >
      {currentStack}
    </RootStack.Navigator>
  );
};

export const Router: React.FC = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

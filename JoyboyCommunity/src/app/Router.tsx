import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useMemo} from 'react';
import {View} from 'react-native';
import {useTheme} from 'styled-components/native';

import {HomeIcon, IndicatorIcon, MessageIcon, NotificationIcon, SearchIcon} from '../assets/icons';
import Error from '../modules/error';
import FeedStackScreen from '../modules/feed/FeedStackScreen';
import Login from '../modules/login';
import Notifications from '../modules/notifications';
import CreatePost from '../modules/post';
import {NoteDetail} from '../screens/NoteDetail';
import {Profile} from '../screens/Profile';
import {useAuth} from '../store/auth';
import {useNavigationStore} from '../store/navigation';
import {HomeStackParams, RootStackParams} from '../types';

const RootStack = createNativeStackNavigator<RootStackParams>();
const HomeBottomTabsStack = createBottomTabNavigator<HomeStackParams>();

const HomeBottomTabNavigator: React.FC = () => {
  const theme = useTheme();
  const {publicKey} = useAuth();

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
          tabBarInactiveTintColor: '',
          tabBarIcon: ({focused}) => {
            return (
              <View style={{flex: 1, alignItems: 'center', gap: 2, justifyContent: 'center'}}>
                <HomeIcon width={24} height={24} fill={focused ? '#14142C' : '#1E2F3D80'} />
                {focused && <IndicatorIcon color="#EC796B" width={6} height={6} />}
              </View>
            );
          },
        }}
      />

      <HomeBottomTabsStack.Screen
        name="UserProfile"
        component={Profile}
        initialParams={{publicKey}}
        options={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '',
          tabBarIcon: ({focused}) => {
            return (
              <View style={{flex: 1, alignItems: 'center', gap: 1, justifyContent: 'center'}}>
                <SearchIcon width={24} height={24} color={focused ? '#14142C' : '#1E2F3D80'} />
                {focused && <IndicatorIcon color="#EC796B" width={6} height={6} />}
              </View>
            );
          },
        }}
      />

      <HomeBottomTabsStack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          tabBarIcon: ({focused}) => {
            return (
              <View style={{flex: 1, alignItems: 'center', gap: 1, justifyContent: 'center'}}>
                <NotificationIcon
                  width={24}
                  height={24}
                  color={focused ? '#14142C' : '#1E2F3D80'}
                />
                {focused && <IndicatorIcon color="#EC796B" width={6} height={6} />}
              </View>
            );
          },
        }}
      />

      <HomeBottomTabsStack.Screen
        name="Messages"
        component={Profile}
        options={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          tabBarIcon: ({focused}) => {
            return (
              <View style={{flex: 1, alignItems: 'center', gap: 4, justifyContent: 'center'}}>
                <MessageIcon width={24} height={24} color={focused ? '#14142C' : '#1E2F3D80'} />
                {focused && <IndicatorIcon color="#EC796B" width={6} height={6} />}
              </View>
            );
          },
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
            <RootStack.Screen name="Profile" component={Profile} />
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

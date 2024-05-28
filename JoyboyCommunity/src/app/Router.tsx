import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useMemo} from 'react';
import {useTheme} from 'styled-components/native';
import Error from '../modules/error';
import FeedStackScreen from '../modules/feed/FeedStackScreen';
import Login from '../modules/login';
import Notifications from '../modules/notifications';
import CreatePost from '../modules/post';
import Profile from '../modules/profile';
import {NoteDetail} from '../screens/NoteDetail';
import {UserDetail} from '../screens/UserDetail';
import {useNavigationStore} from '../store/navigation';
import {HomeStackParams, RootStackParams} from '../types';
import {View} from 'react-native';
import NotificationIcon from '../assets/feed/notification';
import IndicatorIcon from '../assets/feed/indicator';
import MessageIcon from '../assets/feed/message';
import SearchIcon from '../assets/feed/search';
import HomeIcon from '../assets/feed/home';


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
          tabBarInactiveTintColor: '',
          tabBarIcon: ({focused}) => {
            return (
              <View style={{flex: 1, alignItems: 'center', gap: 2, justifyContent: 'center'}}>
                <HomeIcon fill={focused ? '#14142C' : '#1E2F3D80'} />
                {focused && <IndicatorIcon />}
              </View>
            );
          },
        }}
      />

      <HomeBottomTabsStack.Screen
        name="Search"
        component={Profile}
        options={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '',
          tabBarIcon: ({focused}) => {
            return (
              <View style={{flex: 1, alignItems: 'center', gap: 1, justifyContent: 'center'}}>
                <SearchIcon stroke={focused ? '#14142C' : '#1E2F3D80'}  />
                {focused && <IndicatorIcon />}
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
                <NotificationIcon stroke={focused ? '#14142C' : '#1E2F3D80'}  />
                {focused && <IndicatorIcon />}
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
                <MessageIcon stroke={focused ? '#14142C' : '#1E2F3D80'} />
                {focused && <IndicatorIcon />}
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

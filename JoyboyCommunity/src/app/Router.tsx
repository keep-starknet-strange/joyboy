import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Icon} from '../components';
import {useStyles} from '../hooks';
import {CreateAccount} from '../screens/Auth/CreateAccount';
import {Login} from '../screens/Auth/Login';
import {SaveKeys} from '../screens/Auth/SaveKeys';
import {CreatePost} from '../screens/CreatePost';
import {EditProfile} from '../screens/EditProfile';
import {Feed} from '../screens/Feed';
import {PostDetail} from '../screens/PostDetail';
import {Profile} from '../screens/Profile';
import {Tips} from '../screens/Tips';
import {useAuth} from '../store/auth';
import {ThemedStyleSheet} from '../styles';
import {AuthStackParams, HomeBottomStackParams, MainStackParams, RootStackParams} from '../types';
import {retrievePublicKey} from '../utils/storage';

const RootStack = createNativeStackNavigator<RootStackParams>();
const AuthStack = createNativeStackNavigator<AuthStackParams>();
const MainStack = createNativeStackNavigator<MainStackParams>();
const HomeBottomTabsStack = createBottomTabNavigator<HomeBottomStackParams>();

const HomeBottomTabNavigator: React.FC = () => {
  const styles = useStyles(stylesheet);

  const {publicKey} = useAuth();

  return (
    <HomeBottomTabsStack.Navigator
      sceneContainerStyle={styles.sceneContainer}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <HomeBottomTabsStack.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '',
          tabBarIcon: ({focused}) => (
            <View style={styles.tabBarIcon}>
              <Icon
                name="HomeIcon"
                size={24}
                color={focused ? 'bottomBarActive' : 'bottomBarInactive'}
              />
              {focused && <Icon name="IndicatorIcon" color="primary" size={6} />}
            </View>
          ),
        }}
      />

      <HomeBottomTabsStack.Screen
        name="Tips"
        component={Tips}
        options={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          tabBarIcon: ({focused}) => (
            <View style={styles.tabBarIcon}>
              <Icon
                name="CoinIcon"
                size={24}
                color={focused ? 'bottomBarActive' : 'bottomBarInactive'}
              />
              {focused && <Icon name="IndicatorIcon" color="primary" size={6} />}
            </View>
          ),
        }}
      />

      <HomeBottomTabsStack.Screen
        name="UserProfile"
        component={Profile as any}
        initialParams={{publicKey}}
        options={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          tabBarIcon: ({focused}) => (
            <View style={styles.tabBarIcon}>
              <Icon
                name="UserIcon"
                size={24}
                color={focused ? 'bottomBarActive' : 'bottomBarInactive'}
              />
              {focused && <Icon name="IndicatorIcon" color="primary" size={6} />}
            </View>
          ),
        }}
      />
    </HomeBottomTabsStack.Navigator>
  );
};

const AuthNavigator: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    retrievePublicKey().then((key) => {
      setPublicKey(key);
    });
  });

  if (publicKey === undefined) return null;

  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      {publicKey && <AuthStack.Screen name="Login" component={Login} />}
      <AuthStack.Screen name="CreateAccount" component={CreateAccount} />
      <AuthStack.Screen name="SaveKeys" component={SaveKeys} />
    </AuthStack.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <MainStack.Navigator screenOptions={{headerShown: false}}>
      <MainStack.Screen name="Home" component={HomeBottomTabNavigator} />
      <MainStack.Screen name="Profile" component={Profile} />
      <MainStack.Screen name="EditProfile" component={EditProfile} />
      <MainStack.Screen name="CreatePost" component={CreatePost} />
      <MainStack.Screen name="PostDetail" component={PostDetail} />
    </MainStack.Navigator>
  );
};

const RootNavigator: React.FC = () => {
  const {publicKey} = useAuth();

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {publicKey ? (
        <RootStack.Screen name="MainStack" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="AuthStack" component={AuthNavigator} />
      )}
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

const stylesheet = ThemedStyleSheet((theme) => ({
  sceneContainer: {
    backgroundColor: theme.colors.background,
  },

  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabBarIcon: {
    flex: 1,
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

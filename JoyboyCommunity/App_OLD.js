// App.js

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import FeedScreen from './src/screens/FeedScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

function App() {
  const [isReady, setIsReady] = React.useState(true);
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const toggleDarkMode = (value) => {
    setIsDarkMode(value);
  };
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 3000); // Splash screen will be shown for 3 seconds
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isReady ? (
          <>
            <Stack.Screen name="Feed" component={FeedScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

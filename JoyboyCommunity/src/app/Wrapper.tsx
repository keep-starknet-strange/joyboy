import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Host as PortalizeProvider} from 'react-native-portalize';
import {ThemeProvider} from 'styled-components/native';

import {RootScreenContainer} from '../components';
import {NostrProvider} from '../context/NostrContext';
import {darkModeColors, lightModeColors} from '../tokens/colors';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {queries: {retry: 2}},
});

export const Wrapper: React.FC = () => {
  const colorScheme = useColorScheme();

  const [theme, setTheme] = useState<typeof darkModeColors | typeof lightModeColors>(
    lightModeColors,
  );

  useEffect(() => {
    // TODO: uncomment when we want to apply themeing
    // setTheme(colorScheme === "light" ? lightModeColors : darkModeColors);
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider theme={theme}>
        <PortalizeProvider>
          <NostrProvider>
            <QueryClientProvider client={queryClient}>
              <RootScreenContainer>
                <App />
              </RootScreenContainer>
            </QueryClientProvider>
          </NostrProvider>
        </PortalizeProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

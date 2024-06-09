import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Host as PortalizeProvider} from 'react-native-portalize';
import {ThemeProvider as StyledThemeProvider} from 'styled-components/native';

import {RootScreenContainer} from '../components';
import {NostrProvider} from '../context/NostrContext';
import {ThemeProvider} from '../context/Theme';
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
    // TODO: uncomment when we want to apply theming
    // setTheme(colorScheme === "light" ? lightModeColors : darkModeColors);
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StyledThemeProvider theme={theme}>
        <ThemeProvider>
          <NostrProvider>
            <QueryClientProvider client={queryClient}>
              <PortalizeProvider>
                <RootScreenContainer>
                  <App />
                </RootScreenContainer>
              </PortalizeProvider>
            </QueryClientProvider>
          </NostrProvider>
        </ThemeProvider>
      </StyledThemeProvider>
    </GestureHandlerRootView>
  );
};

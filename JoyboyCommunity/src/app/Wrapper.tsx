import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Host as PortalizeProvider} from 'react-native-portalize';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider as StyledThemeProvider} from 'styled-components/native';

import {RootScreenContainer} from '../components';
import {DialogProvider} from '../context/Dialog';
import {NostrProvider} from '../context/NostrContext';
import {ThemeProvider} from '../context/Theme';
import {TipModalProvider} from '../context/TipModal';
import {ToastProvider} from '../context/Toast/ToastContext';
import {TransactionModalProvider} from '../context/TransactionModal';
import {WalletModalProvider} from '../context/WalletModal';
import {darkModeColors, lightModeColors} from '../tokens/colors';
import App from './App';
import {StarknetProvider} from './StarknetProvider';

const queryClient = new QueryClient({
  defaultOptions: {queries: {retry: 2}},
});

const ModalProviders = ({children}: {children: React.ReactNode}) => {
  return (
    <ToastProvider>
      <DialogProvider>
        <WalletModalProvider>
          <TransactionModalProvider>
            <TipModalProvider>{children}</TipModalProvider>
          </TransactionModalProvider>
        </WalletModalProvider>
      </DialogProvider>
    </ToastProvider>
  );
};

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
              <StarknetProvider>
                <SafeAreaProvider>
                  <PortalizeProvider>
                    <ModalProviders>
                      <RootScreenContainer>
                        <App />
                      </RootScreenContainer>
                    </ModalProviders>
                  </PortalizeProvider>
                </SafeAreaProvider>
              </StarknetProvider>
            </QueryClientProvider>
          </NostrProvider>
        </ThemeProvider>
      </StyledThemeProvider>
    </GestureHandlerRootView>
  );
};

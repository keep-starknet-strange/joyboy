import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Host as PortalizeProvider} from 'react-native-portalize';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {RootScreenContainer} from '../components';
import {DialogProvider} from '../context/Dialog';
import {NostrProvider} from '../context/NostrContext';
import {ThemeProvider} from '../context/Theme';
import {TipModalProvider} from '../context/TipModal';
import {ToastProvider} from '../context/Toast/ToastContext';
import {TransactionModalProvider} from '../context/TransactionModal';
import {WalletModalProvider} from '../context/WalletModal';
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
  return (
    <GestureHandlerRootView style={{flex: 1}}>
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
    </GestureHandlerRootView>
  );
};

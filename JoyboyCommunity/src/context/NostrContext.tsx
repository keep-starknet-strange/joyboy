import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {createContext} from 'react';

export const NostrContext = createContext<any>(null);

const queryClient = new QueryClient({
  defaultOptions: {queries: {retry: 2}},
});

export default function NostrProvider({children}: {children: React.ReactNode}) {
  return (
    <NostrContext.Provider value="">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NostrContext.Provider>
  );
}

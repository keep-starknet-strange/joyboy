import {randomUUID} from 'expo-crypto';
import {createContext, useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {ToastProps} from '../../components/Toast';
import {AnimatedToast} from './AnimatedToast';
import styles from './styles';

export type ToastConfig = ToastProps & {
  key: string;
  timeout?: number;
};

export type ToastContextType = {
  showToast: (toast: Omit<ToastConfig, 'key'>) => () => void;
  hideToast: (key: string) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const hideToast = useCallback((key: string) => {
    setToasts((prev) => prev.filter((t) => t.key !== key));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastConfig, 'key'>) => {
      const key = randomUUID();

      setToasts((prev) => [...prev, {...toast, key}]);

      return () => hideToast(key);
    },
    [hideToast],
  );

  const context = useMemo(() => ({showToast, hideToast}), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={context}>
      {children}

      {toasts.length > 0 && (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            {toasts.map((toast) => (
              <AnimatedToast key={toast.key} toast={toast} hide={() => hideToast(toast.key)} />
            ))}
          </View>
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
};

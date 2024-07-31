import '@walletconnect/react-native-compat';

import {starknetChainId, useAccount} from '@starknet-react/core';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';

import {CHAIN_ID} from '../constants/env';
import {useTips} from '../hooks';
import {useDialog, useToast} from '../hooks/modals';
import {Router} from './Router';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [sentTipNotification, setSentTipNotification] = useState(false);

  const tips = useTips();
  const {showToast} = useToast();

  const {showDialog, hideDialog} = useDialog();

  const account = useAccount();

  useEffect(() => {
    const chainId = account.chainId ? starknetChainId(account.chainId) : undefined;

    if (chainId) {
      if (chainId !== CHAIN_ID) {
        showDialog({
          title: 'Wrong Network',
          description:
            'Joyboy currently only supports the Starknet Sepolia network. Please switch to the Sepolia network to continue.',
          buttons: [],
        });
      } else {
        hideDialog();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.chainId]);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          'Poppins-Light': require('../../assets/fonts/Poppins/Poppins-Light.ttf'),
          'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
          'Poppins-Italic': require('../../assets/fonts/Poppins/Poppins-Italic.ttf'),
          'Poppins-Medium': require('../../assets/fonts/Poppins/Poppins-Medium.ttf'),
          'Poppins-SemiBold': require('../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
          'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => tips.refetch(), 2 * 60 * 1_000);
    return () => clearInterval(interval);
  }, [tips]);

  useEffect(() => {
    if (sentTipNotification) return;

    const hasUnclaimedTip = (tips.data ?? []).some((tip) => !tip.claimed && tip.depositId);
    if (hasUnclaimedTip) {
      setSentTipNotification(true);
      showToast({
        type: 'info',
        title: 'You have unclaimed tips',
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tips.data]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
      <Router />
    </View>
  );
}

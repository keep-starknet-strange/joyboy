import {useAccount} from '@starknet-react/core';
import {useEffect, useRef} from 'react';

export const useWaitConnection = () => {
  const {address} = useAccount();

  const promise = useRef<Promise<boolean>>();
  const promiseResolve = useRef<(value: boolean) => void>();

  useEffect(() => {
    if (address && promise.current) {
      promiseResolve.current(true);

      promise.current = undefined;
      promiseResolve.current = undefined;
    }
  }, [address]);

  const waitConnection = () => {
    if (address) {
      return true;
    }

    if (promise.current) {
      // If a promise is already in progress, resolve it with false
      promiseResolve.current(false);

      promise.current = undefined;
      promiseResolve.current = undefined;
    }

    promise.current = new Promise((resolve) => {
      promiseResolve.current = resolve;
    });

    return promise.current;
  };

  return waitConnection;
};

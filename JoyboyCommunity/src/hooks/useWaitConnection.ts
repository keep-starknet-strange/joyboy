import {useAccount, UseAccountResult} from '@starknet-react/core';
import {useEffect, useRef} from 'react';

export const useWaitConnection = () => {
  const account = useAccount();

  const promise = useRef<Promise<false | UseAccountResult>>();
  const promiseResolve = useRef<(value: false | UseAccountResult) => void>();

  useEffect(() => {
    if (account.address && promise.current) {
      promiseResolve.current?.(account);

      promise.current = undefined;
      promiseResolve.current = undefined;
    }
  }, [account]);

  const waitConnection = () => {
    if (account.address) {
      return account;
    }

    if (promise.current) {
      // If a promise is already in progress, resolve it with false
      promiseResolve.current?.(false);

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

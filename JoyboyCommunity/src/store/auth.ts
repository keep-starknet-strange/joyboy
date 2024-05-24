import {createStore} from 'zustand';

import createBoundedUseStore from './createBoundedUseStore';

type State = {
  publicKey: string | null;
  privateKey: Uint8Array | null;
};

type Action = {
  setAuth: (publicKey: string, privateKey: Uint8Array) => void;
};

export const authStore = createStore<State & Action>((set, get) => ({
  publicKey: null,
  privateKey: null,

  setAuth: (publicKey, privateKey) => {
    set({publicKey, privateKey});
  },
}));

export const useAuth = createBoundedUseStore(authStore);

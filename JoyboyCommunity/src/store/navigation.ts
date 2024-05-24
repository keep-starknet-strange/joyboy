import {createStore} from 'zustand/vanilla';

import createBoundedUseStore from '../store/createBoundedUseStore';

export type Stacks = 'app' | 'login' | 'loading';
export type CreateWalletStackScreens = 'SecretPhrase' | 'Email';

type State = {
  stack: Stacks;
};

type Action = {
  setStack: (newStack: Stacks) => void;
};
export interface NavigationContextProps {
  stack: Stacks;
  setStack: () => void;
}

const navigationStore = createStore<State & Action>((set, get) => ({
  stack: 'login',
  setStack: (newStack) => {
    set({stack: newStack});
  },
}));

export const useNavigationStore = createBoundedUseStore(navigationStore);

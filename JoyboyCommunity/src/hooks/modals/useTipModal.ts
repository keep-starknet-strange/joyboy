import {useContext} from 'react';

import {TipModalContext} from '../../context/TipModal';

export const useTipModal = () => {
  const context = useContext(TipModalContext);

  if (!context) {
    throw new Error('useTipModal must be used within a TipModalProvider');
  }

  return context;
};

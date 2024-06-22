import {useContext, useMemo} from 'react';

import {DialogContext} from '../../context/Dialog';

export const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }

  return useMemo(() => ({showDialog: context.show, hideDialog: context.hide}), [context]);
};

import {useQuery} from '@tanstack/react-query';

import {useNostrContext} from '../context/NostrContext';
import {EventKind} from '../types';

export type UseNoteOptions = {
  noteId: string;
};

export const useNote = (options: UseNoteOptions) => {
  const {pool, relays} = useNostrContext();

  return useQuery({
    queryKey: ['note', options.noteId],
    queryFn: async () => {
      const note = await pool.get(relays, {
        kinds: [EventKind.Note],
        ids: [options.noteId],
      });

      return note;
    },
  });
};

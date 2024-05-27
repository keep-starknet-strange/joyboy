import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Event as EventNostr} from 'nostr-tools';
import {finalizeEvent, NostrEvent, parseReferences, VerifiedEvent, verifyEvent} from 'nostr-tools';
import {useContext} from 'react';

import {NDKContext} from '../context/NDKContext';
import {PoolContext} from '../context/PoolContext';
import {IPoolEventsByQuery, IPoolEventsFromPubkey, ISendNotePayload, IUserQuery} from '../types';
import {RELAYS_PROD} from '../utils/relay';
import {retrievePublicKey} from '../utils/storage';

interface IIsEventBool {
  isSetEvents: boolean;
}

export const useGetPoolEventById = (id: string) => {
  const pool = useContext(PoolContext);
  const relays = RELAYS_PROD;

  const {
    data: singlePoolEventData,
    isPending: singlePoolEventDataLoading,
    error: singlePoolEventDataError,
  } = useQuery({
    queryFn: async () => {
      const data = await pool.get(relays, {ids: [id]}, {});

      // const parseEvent = parsingEventContent(data) as unknown as EventNostr;
      return data as EventNostr;
    },
    queryKey: ['getPoolEventById', id],
  });

  return {
    singlePoolEventData,
    singlePoolEventDataLoading,
    singlePoolEventDataError,
  };
};

export const useGetPoolEvents = () => {
  const pool = useContext(PoolContext);
  const relays = RELAYS_PROD;

  const {
    data: poolEventsData,
    isPending: poolEventsDataLoading,
    error: poolEventsDataError,
  } = useQuery({
    queryFn: () => pool.querySync(relays, {kinds: [0, 1]}, {}),
    queryKey: ['getPoolEvents'],
  });

  return {
    poolEventsData,
    poolEventsDataLoading,
    poolEventsDataError,
  };
};

export const useGetPoolEventsNotes = () => {
  const pool = useContext(PoolContext);
  const relays = RELAYS_PROD;

  const {
    data: poolEventNotesData,
    isPending: poolEventNotesDataLoading,
    error: poolEventNotesDataError,
  } = useQuery({
    queryFn: () => pool.querySync(relays, {kinds: [1]}, {}),
    queryKey: ['getPoolEventsNotes'],
  });

  return {
    poolEventNotesData,
    poolEventNotesDataLoading,
    poolEventNotesDataError,
  };
};

export const useGetPoolEventUser = () => {
  const pool = useContext(PoolContext);
  const relays = RELAYS_PROD;

  const {
    data: poolEventsUser,
    isPending: poolEventsUserLoading,
    error: poolEventsUserError,
  } = useQuery({
    queryFn: () => pool.querySync(relays, {kinds: [0]}, {}),
    queryKey: ['getPoolEventUser'],
  });

  return {
    poolEventsUser,
    poolEventsUserLoading,
    poolEventsUserError,
  };
};

export const useGetPoolEventsFromPubkey = (query: IPoolEventsFromPubkey) => {
  const pool = useContext(PoolContext);
  const relays = RELAYS_PROD;

  const {
    data: poolEventsDataFromPubkey,
    isPending: poolEventsFromPubkeyLoading,
    error: poolEventsErrorFromPubkey,
  } = useQuery({
    queryFn: () =>
      pool.querySync(query.relaysUser ?? relays, {
        kinds: query.kinds ?? [1, 3],
        authors: [query.pubkey],
      }),
    queryKey: ['getPoolEventsFromPubkey', query.relaysUser, query.kinds],
  });

  return {
    poolEventsDataFromPubkey,
    poolEventsFromPubkeyLoading,
    poolEventsErrorFromPubkey,
  };
};

export const useGetPoolUserQuery = ({id = '0', ...query}: IUserQuery) => {
  const pool = useContext(PoolContext);
  const relays = RELAYS_PROD;

  const {
    data: poolUserQueryData,
    isPending: poolUserQueryDataLoading,
    error: poolUserQueryDataError,
  } = useQuery({
    queryFn: () =>
      pool.get(relays, {
        kinds: [Number(id)],
        authors: [query.pubkey],
      }),
    queryKey: ['getPoolUserQuery', id, query.pubkey],
  });

  return {
    poolUserQueryData,
    poolUserQueryDataLoading,
    poolUserQueryDataError,
  };
};

export const useGetPoolEventsByQuery = ({ids = ['1', '3'], ...query}: IPoolEventsByQuery) => {
  const pool = useContext(PoolContext);
  const relays = RELAYS_PROD;

  const {
    data: poolEventsDataByQuery,
    isPending: poolEventsByQueryLoading,
    error: poolEventsErrorByQuery,
  } = useQuery({
    queryFn: () =>
      pool.querySync(query.relaysProps ?? relays, {
        ids,
        ...query.filter,
      }),
    queryKey: ['getPoolEventsByQuery', query.relaysProps, query.filter, ids],
  });

  return {
    poolEventsDataByQuery,
    poolEventsByQueryLoading,
    poolEventsErrorByQuery,
  };
};

export const useGetPoolEventsNotesFromPubkey = (query: IPoolEventsFromPubkey) => {
  const pool = useContext(PoolContext);
  const relays = RELAYS_PROD;

  const {
    data: poolEventsNotesDataFromPubkey,
    isPending: poolEventsNotesFromPubkeyLoading,
    error: poolEventsNotesErrorFromPubkey,
  } = useQuery({
    queryFn: () =>
      pool.querySync(query.relaysUser ?? relays, {
        kinds: query.kinds ?? [1],
        authors: [query.pubkey],
      }),
    queryKey: ['getPoolEventsNotesFromPubkey', query.relaysUser, query.kinds],
  });

  return {
    poolEventsNotesDataFromPubkey,
    poolEventsNotesFromPubkeyLoading,
    poolEventsNotesErrorFromPubkey,
  };
};

export const useGetUser = (pubkey: string) => {
  const ndk = useContext(NDKContext);

  const {
    data: userData,
    isPending: userDataLoading,
    error: userDataError,
  } = useQuery({
    queryFn: () => ndk.getUser({pubkey}),
    queryKey: ['getUser', pubkey],
  });

  return {
    userData,
    userDataLoading,
    userDataError,
  };
};

export const useSendNote = () => {
  const queryClient = useQueryClient();
  const {isPending: sendNoteLoading, mutate: mutateSendNote} = useMutation({
    mutationFn: sendNote,
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: [''],
      });
    },
  });

  return {
    sendNoteLoading,
    mutateSendNote,
  };
};

export const useRetrievePublicKey = () => {
  // const [isConnected, setIsConnected] = useState(false);
  const {
    data: publicKeyData,
    isPending: publicKeyDataLoading,
    error: publicKeyDataError,
  } = useQuery({
    queryFn: () => retrievePublicKey(),
    queryKey: ['getPublicKey'],
  });

  // if (!publicKeyDataLoading && publicKeyData) {
  //   setIsConnected(true);
  // }
  const isConnected = !publicKeyDataLoading && publicKeyData ? true : false;

  return {
    publicKeyData,
    publicKeyDataLoading,
    publicKeyDataError,
    isConnected,
  };
};

// FUNCTIONS

export const sendNote = async ({
  content,
  sk,
  tags,
}: ISendNotePayload): Promise<{
  event?: VerifiedEvent;
  isValid?: boolean;
}> => {
  try {
    const event = finalizeEvent(
      {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: tags ?? [],
        content,
      },
      sk,
    );
    console.log('event', event);

    const isGood = verifyEvent(event);

    if (isGood) {
      return {
        event,
        isValid: true,
      };
    } else {
      return {
        event,
        isValid: false,
      };
    }
  } catch (e) {
    console.log('issue sendNote', e);
    return {
      event: undefined,
      isValid: false,
    };
  }
};

export const parsingEventContent = (event?: NostrEvent) => {
  try {
    const references = parseReferences(event);
    const simpleAugmentedContent = event.content;

    let profilesCache;
    let eventsCache;
    for (let i = 0; i < references.length; i++) {
      const {text, profile, event, address} = references[i];
      const augmentedReference = profile ? (
        <strong>@${profilesCache[profile.pubkey].name}</strong>
      ) : event ? (
        <em>${eventsCache[event.id].content.slice(0, 5)}</em>
      ) : address ? (
        <a href="${text}">[link]</a>
      ) : (
        text
      );
      // simpleAugmentedContent.replaceAll(text, augmentedReference);
      simpleAugmentedContent.replaceAll(text, augmentedReference?.toString());
    }

    return simpleAugmentedContent;
  } catch (e) {}
};

/** @TODO finish Give NIP05 parsed content */
export const parsingNip05EventContent = (event?: NostrEvent) => {
  try {
    const references = parseReferences(event);
    const simpleAugmentedContent = event.content;
    let profilesCache;
    const stringify = JSON.parse(simpleAugmentedContent);
    return stringify;
  } catch (e) {}
};

export const useRevalidate = () => {
  const queryClient = useQueryClient();
  const revalidate = (keys: string) => {
    queryClient.invalidateQueries({
      queryKey: [keys],
      refetchType: 'active',
    });
  };

  return {
    revalidate,
  };
};

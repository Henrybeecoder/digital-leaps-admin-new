import { FirebaseError } from 'firebase/app';
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../fire';
import { DataReturnType, MessageType } from '../../../types';

export const useGetSubscriptions: () => Omit<DataReturnType, 'onSearch'> & {
  subscriptions: any[];
} = () => {
  const max = 8;
  const [{ count, type }, setPage] = useState<{
    count: number;
    type?: 'next' | 'prev';
  }>({
    count: 0,
  });

  const [{ snapshot, loading, error }, setState] = useState<{
    snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>[];
    loading: boolean;
    error: FirebaseError | undefined;
  }>({
    snapshot: [],
    loading: false,
    error: undefined,
  });

  const lastVisible = snapshot[snapshot?.length - 1];

  const fetchRef =
    count > 0
      ? query(
          collection(db, 'emailSubscriptions'),
          orderBy('dateSubscribed'),
          type === 'prev'
            ? endBefore(lastVisible || '')
            : startAfter(lastVisible || ''),
          limit(max)
        )
      : query(
          collection(db, 'emailSubscriptions'),
          orderBy('dateSubscribed'),
          limit(max)
        );

  useEffect(() => {
    setState((x) => ({ ...x, loading: true }));

    const unsub = onSnapshot(
      fetchRef,
      (snapshot) => {
        setState((x) => ({ ...x, snapshot: snapshot.docs, loading: false }));
      },
      (error) => {
        setState((x) => ({ ...x, loading: false, error }));
      }
    );

    return () => {
      unsub();
    };
  }, [count]);

  return {
    subscriptions: snapshot?.map((x) => ({ ...x.data(), id: x.id })) as any,
    loading,
    error,
    prev: () => setPage((x) => ({ count: x.count - 1, type: 'prev' })),
    next: () => setPage((x) => ({ count: x.count + 1, type: 'next' })),
    prevDisabled: count < 1,
    nextDisabled: snapshot.length < max,
  };
};

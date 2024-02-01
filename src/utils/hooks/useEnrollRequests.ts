import { FirebaseError } from 'firebase/app';
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  endBefore,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../fire';
import { EnrollRequest } from '../../../types';

export const useGetEnrollRequest = () => {
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

  //   const [keyword, setKeyword] = useState<string | undefined>();

  //   const searchRef = query(
  //     collection(db, 'enrollRequests'),
  //     where('displayName', '==', `${keyword}`)
  //     // orderBy('dateEnrolled'),
  //     // limit(max)
  //   );

  const lastVisible = snapshot[snapshot?.length - 1];

  const noFilterQ =
    count > 0
      ? query(
          collection(db, 'enrollRequests'),
          orderBy('dateEnrolled'),
          type === 'prev'
            ? endBefore(lastVisible || '')
            : startAfter(lastVisible || ''),
          limit(max)
        )
      : query(
          collection(db, 'enrollRequests'),
          orderBy('dateEnrolled'),
          limit(max)
        );

  const fetchRef = noFilterQ;

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
    requests: snapshot?.map((x) => ({
      ...x.data(),
      id: x.id,
    })) as EnrollRequest[],
    loading,
    error,
    // onSearch: setKeyword,
    prev: () => setPage((x) => ({ count: x.count - 1, type: 'prev' })),
    next: () => setPage((x) => ({ count: x.count + 1, type: 'next' })),
    prevDisabled: count < 1,
    nextDisabled: snapshot.length < max,
  };
};

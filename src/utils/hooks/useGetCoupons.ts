import { FirebaseError } from 'firebase/app';
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  endBefore,
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
import { CouponType, DataReturnType } from '../../../types';

export const useGetCoupons: (
  filter: 'All' | 'Active' | 'Inactive'
) => DataReturnType & {
  coupons: CouponType[];
  onSearch: (keyword: string) => void;
} = (filter) => {
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

  const [keyword, setKeyword] = useState<string | undefined>();

  const searchRef = query(
    collection(db, 'coupons'),
    where('couponId', '==', `${keyword}`)
    // orderBy('dateRegistered'),
    // limit(8)
  );

  const lastVisible = snapshot[snapshot?.length - 1];

  const noFilterQ =
    count > 0
      ? query(
          collection(db, 'coupons'),
          orderBy('registrationDate'),
          type === 'prev'
            ? endBefore(lastVisible || '')
            : startAfter(lastVisible || ''),
          limit(max)
        )
      : query(
          collection(db, 'coupons'),
          orderBy('registrationDate'),
          limit(max)
        );

  const filterQ =
    count > 0
      ? query(
          collection(db, 'coupons'),
          where('status', '==', filter),
          orderBy('registrationDate'),
          type === 'prev'
            ? endBefore(lastVisible || '')
            : startAfter(lastVisible || ''),
          limit(max)
        )
      : query(
          collection(db, 'coupons'),
          where('status', '==', filter),
          orderBy('registrationDate'),
          limit(max)
        );

  const fetchRef =
    keyword && keyword.length > 1
      ? searchRef
      : !filter || filter === 'All'
      ? noFilterQ
      : filterQ;

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
    return () => unsub();
  }, [filter, keyword, count]);

  return {
    coupons: snapshot?.map((x) => ({ ...x.data(), id: x.id })) as any,
    loading,
    error,
    onSearch: setKeyword,
    prev: () => setPage((x) => ({ count: x.count - 1, type: 'prev' })),
    next: () => setPage((x) => ({ count: x.count + 1, type: 'next' })),
    prevDisabled: count < 1,
    nextDisabled: snapshot.length < max,
  };
};

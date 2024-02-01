import { useEffect, useState } from 'react';
import { DataReturnType } from '../../../types';
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
import { FirebaseError } from 'firebase/app';
import { db } from '../fire';

export const useGetCategories: () => DataReturnType & {
  categories: any[];
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

  const [keyword, setKeyword] = useState<string | undefined>();

  const searchRef = query(
    collection(db, 'blogCategories'),
    where('displayName', '==', `${keyword}`)
    // orderBy('dateRegistered'),
    // limit(max)
  );

  const lastVisible = snapshot[snapshot?.length - 1];

  const noFilterQ =
    count > 0
      ? query(
          collection(db, 'blogCategories'),
          //   orderBy('dateRegistered'),
          type === 'prev'
            ? endBefore(lastVisible || '')
            : startAfter(lastVisible || ''),
          limit(max)
        )
      : query(
          collection(db, 'blogCategories'),
          //   orderBy('dateRegistered'),
          limit(max)
        );

  const fetchRef = keyword && keyword.length > 1 ? searchRef : noFilterQ;

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
  }, [keyword, count]);

  return {
    categories: snapshot?.map((x) => ({ ...x.data(), id: x.id })) as any,
    loading,
    error,
    onSearch: setKeyword,
    prev: () => setPage((x) => ({ count: x.count - 1, type: 'prev' })),
    next: () => setPage((x) => ({ count: x.count + 1, type: 'next' })),
    prevDisabled: count < 1,
    nextDisabled: snapshot.length < max,
  };
};

export const useGetBlogPosts: (categoryId: string | undefined) => Omit<
  DataReturnType,
  'onSearch'
> & {
  articles: any[];
} = (categoryId) => {
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

  const ref =
    count > 0
      ? query(
          collection(db, 'blogPosts'),
          where('categoryId', '==', `${categoryId}`),
          // orderBy('dateCreated'),
          type === 'prev'
            ? endBefore(lastVisible || '')
            : startAfter(lastVisible || ''),
          limit(max)
        )
      : query(
          collection(db, 'blogPosts'),
          where('categoryId', '==', `${categoryId}`),
          // orderBy('dateCreated'),
          limit(max)
        );

  useEffect(() => {
    if (!categoryId) return;
    setState((x) => ({ ...x, loading: true }));

    const unsub = onSnapshot(
      ref,
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
    articles: snapshot?.map((x) => ({ ...x.data(), id: x.id })) as any,
    loading,
    error,
    prev: () => setPage((x) => ({ count: x.count - 1, type: 'prev' })),
    next: () => setPage((x) => ({ count: x.count + 1, type: 'next' })),
    prevDisabled: count < 1,
    nextDisabled: snapshot.length < max,
  };
};

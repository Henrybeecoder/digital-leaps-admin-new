import { FirebaseError } from 'firebase/app';
import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
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
import { CourseType, DataReturnType, UserType } from '../../../types';

export const useGetStudents: (
  filter?: 'All' | 'Active' | 'Inactive'
) => DataReturnType & {
  students: UserType[];
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
    collection(db, 'users'),
    where('displayName', '==', `${keyword}`)
    // orderBy('dateRegistered'),
    // limit(max)
  );

  const lastVisible = snapshot[snapshot?.length - 1];

  const noFilterQ =
    count > 0
      ? query(
          collection(db, 'users'),
          orderBy('dateRegistered'),
          type === 'prev'
            ? endBefore(lastVisible || '')
            : startAfter(lastVisible || ''),
          limit(max)
        )
      : query(collection(db, 'users'), orderBy('dateRegistered'), limit(max));

  const filterQ =
    count > 0
      ? query(
          collection(db, 'users'),
          where('status', '==', filter),
          orderBy('dateRegistered'),
          type === 'prev'
            ? endBefore(lastVisible || '')
            : startAfter(lastVisible || ''),
          limit(max)
        )
      : query(
          collection(db, 'users'),
          where('status', '==', filter),
          orderBy('dateRegistered'),
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

    return () => {
      unsub();
    };
  }, [filter, keyword, count]);

  return {
    students: snapshot?.map((x) => ({ ...x.data(), id: x.id })) as any,
    loading,
    error,
    onSearch: setKeyword,
    prev: () => setPage((x) => ({ count: x.count - 1, type: 'prev' })),
    next: () => setPage((x) => ({ count: x.count + 1, type: 'next' })),
    prevDisabled: count < 1,
    nextDisabled: snapshot.length < max,
  };
};

export const useGetStudent: (
  id: string | undefined
) => [UserType, boolean, FirebaseError | undefined] = (id) => {
  const [{ data, loading, error }, setState] = useState<{
    data: any;
    loading: boolean;
    error: FirebaseError | undefined;
  }>({
    data: undefined,
    loading: false,
    error: undefined,
  });

  useEffect(() => {
    if (!id) return;

    const q = doc(db, 'users', id);
    setState((x) => ({ ...x, loading: true }));

    (async () => {
      try {
        const res = await getDoc(q);
        setState((x) => ({
          ...x,
          loading: false,
          data: { ...res.data(), id: res.id },
        }));
      } catch (err) {
        const error = err as FirebaseError;
        setState((x) => ({ ...x, loading: false, error }));
      }
    })();
  }, [id]);

  return [data, loading, error];
};

export const useGetStudentCourses: (
  id: string | undefined,
  filter: 'All' | 'Paid' | 'Unpaid'
) => {
  courses: (CourseType & {
    status: 'Paid' | 'Unpaid';
    invoiceNumber: string;
  })[];
  loading: boolean;
  error: FirebaseError | undefined;
} = (id, filter) => {
  const [{ data, loading, error }, setState] = useState<{
    data: any[];
    loading: boolean;
    error: FirebaseError | undefined;
  }>({
    data: [],
    loading: false,
    error: undefined,
  });

  useEffect(() => {
    if (!id) return;

    const q =
      filter !== 'All'
        ? query(
            collection(db, `users/${id}/myCourses`),
            where('status', '==', filter)
          )
        : collection(db, `users/${id}/myCourses`);
    setState((x) => ({ ...x, loading: true }));

    onSnapshot(q, (snapshot) => {
      setState((x) => ({
        ...x,
        data: snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
        loading: false,
      }));
    });
  }, [id, filter]);

  return { courses: data, loading, error };
};

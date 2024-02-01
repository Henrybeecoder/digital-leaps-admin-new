import { FirebaseError } from 'firebase/app';
import {
  DocumentData,
  QueryDocumentSnapshot,
  and,
  collection,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  or,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../fire';
import { CourseType, DataReturnType, MentorType } from '../../../types';

export const useGetmentors: (
  filter?: 'All' | 'Active' | 'Inactive'
) => DataReturnType & {
  mentors: MentorType[];
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
    collection(db, 'mentors'),
    where('name', '==', `${keyword}`)
    // orderBy('dateRegistered'),
    // limit(8)
  );

  const lastVisible = snapshot[snapshot?.length - 1];

  const noFilterQ =
    count > 0
      ? query(
          collection(db, 'mentors'),
          // where('status', '==', `Active`),
          // orderBy('status'),
          orderBy('dateRegistered'),
          type === 'prev'
            ? endBefore(lastVisible || '')
            : startAfter(lastVisible || ''),
          limit(max)
        )
      : query(
          collection(db, 'mentors'),
          // where('status', '==', `Active`),
          // orderBy('status'),
          orderBy('dateRegistered'),
          limit(max)
        );

  const filterQ =
    count > 0
      ? query(
          collection(db, 'mentors'),
          where('status', '==', `${filter}`),
          orderBy('dateRegistered'),
          type === 'prev'
            ? endBefore(lastVisible || '')
            : startAfter(lastVisible || ''),
          limit(max)
        )
      : query(
          collection(db, 'mentors'),
          where('status', '==', `${filter}`),
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
    mentors: snapshot?.map((x) => ({ ...x.data(), id: x.id })) as any,
    loading,
    error,
    onSearch: setKeyword,
    prev: () => setPage((x) => ({ count: x.count - 1, type: 'prev' })),
    next: () => setPage((x) => ({ count: x.count + 1, type: 'next' })),
    prevDisabled: count < 1,
    nextDisabled: snapshot.length < max,
  };
};

export const useGetmentorRequests: () => Omit<DataReturnType, 'onSearch'> & {
  requests: any[];
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
          collection(db, 'mentorRequests'),
          orderBy('timeStamp'),
          type === 'prev'
            ? endBefore(lastVisible || '')
            : startAfter(lastVisible || ''),
          limit(max)
        )
      : query(
          collection(db, 'mentorRequests'),
          orderBy('timeStamp'),
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
    requests: snapshot?.map((x) => ({ ...x.data(), id: x.id })) as any,
    loading,
    error,
    prev: () => setPage((x) => ({ count: x.count - 1, type: 'prev' })),
    next: () => setPage((x) => ({ count: x.count + 1, type: 'next' })),
    prevDisabled: count < 1,
    nextDisabled: snapshot.length < max,
  };
};

export const useGetMentorCourses: (id: string | undefined) => {
  courses: CourseType[];
  loading: boolean;
  error: FirebaseError | undefined;
  onSearch: (keyword: string) => void;
} = (id) => {
  const [{ data, loading, error }, setState] = useState<{
    data: any[];
    loading: boolean;
    error: FirebaseError | undefined;
  }>({
    data: [],
    loading: false,
    error: undefined,
  });

  const [keyword, setKeyword] = useState<string | undefined>();

  const searchRef = query(
    collection(db, 'courses'),
    and(
      where('instructorId', '==', id),
      or(where('id', '==', `${keyword}`), where('title', '==', `${keyword}`))
    )
    // orderBy('dateRegistered'),
    // limit(8)
  );

  useEffect(() => {
    if (!id) return;

    setState((x) => ({ ...x, loading: true }));

    const fetchRef =
      keyword && keyword.length > 1
        ? searchRef
        : query(
            collection(db, 'courses'),
            or(
              where('instructorId', '==', id),
              where('instructor2Id', '==', id)
            )
            // orderBy('createdAt'),
            // limit(8)
          );

    const lastVisible = data[data.length - 1];

    // const next =
    //   !filter ||filter === 'All'
    //     ? query(
    //         collection(db, 'mentors'),
    //         orderBy('dateRegistered'),
    //         startAfter(lastVisible),
    //         limit(8)
    //       )
    //     : query(
    //         collection(db, 'mentors'),
    //         where('status', '==', filter),
    //         orderBy('dateRegistered'),
    //         startAfter(lastVisible),
    //         limit(8)
    //       );

    (async () => {
      try {
        const res = await getDocs(fetchRef);
        setState((x) => ({
          ...x,
          loading: false,
          data: res.docs.map((x) => ({ ...x.data(), id: x.id })),
        }));
      } catch (err) {
        const error = err as FirebaseError;
        setState((x) => ({ ...x, loading: false, error }));
      }
    })();
  }, [id, keyword]);

  return { courses: data, loading, error, onSearch: setKeyword };
};

export const useGetMentor: (
  id: string | undefined
) => [MentorType, boolean, FirebaseError | undefined] = (id) => {
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

    setState((x) => ({ ...x, loading: true }));

    (async () => {
      try {
        const res = await getDoc(doc(db, 'mentors', id));
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

export const useGetMentorRequest: (
  id: string | undefined
) => [any, boolean, FirebaseError | undefined] = (id) => {
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

    setState((x) => ({ ...x, loading: true }));

    (async () => {
      try {
        const res = await getDoc(doc(db, 'mentorRequests', id));
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

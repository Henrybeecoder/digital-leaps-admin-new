import {
  DocumentData,
  QueryDocumentSnapshot,
  and,
  collection,
  endBefore,
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
import { CourseUserType } from '../../../types';
import { FirebaseError } from 'firebase/app';

export const useGetRegisteredStudents = (courseId: string, filter: string) => {
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
    collection(db, `userCourses/${courseId}/students`),
    or(
      where('invoiceNumber', '==', `${keyword}`),
      where('fullName', '==', `${keyword}`)
    )
    // orderBy('dateRegistered'),
    // limit(8)
  );

  const lastVisible = snapshot[snapshot?.length - 1];

  useEffect(() => {
    setState((x) => ({ ...x, loading: true }));
    const fetchRef =
      keyword && keyword.length > 1
        ? searchRef
        : count > 0
        ? query(
            collection(db, `userCourses/${courseId}/students`),
            orderBy('dateRegistered', 'desc'),
            type === 'prev'
              ? endBefore(lastVisible || '')
              : startAfter(lastVisible || ''),
            limit(max)
          )
        : query(collection(db, `userCourses/${courseId}/students`), limit(max));
    const unsub = onSnapshot(
      filter === 'All'
        ? fetchRef
        : query(fetchRef, where('status', '==', filter)),
      (snapshot) => {
        setState((x) => ({ ...x, snapshot: snapshot.docs, loading: false }));
      },
      (error) => {
        setState((x) => ({ ...x, loading: false, error }));
      }
    );

    return () => unsub();
  }, [courseId, filter, keyword, count]);

  return {
    loading,
    students: snapshot?.map((x) => ({
      ...x.data(),
      id: x.id,
    })) as CourseUserType[],
    onSearch: setKeyword,
    prev: () => setPage((x) => ({ count: x.count - 1, type: 'prev' })),
    next: () => setPage((x) => ({ count: x.count + 1, type: 'next' })),
    prevDisabled: count < 1,
    nextDisabled: snapshot.length < max,
  };
};

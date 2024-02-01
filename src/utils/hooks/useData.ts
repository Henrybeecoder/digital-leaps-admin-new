import {
  //   DocumentData,
  //   QueryDocumentSnapshot,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../fire';
import toast from 'react-hot-toast';

export const useGetCollection = (collectionName: string, where?: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!collectionName) return;
    const ref = collection(db, collectionName);
    setLoading(true);
    const unsub = onSnapshot(
      where ? query(collection(db, collectionName), where) : ref,
      (snapshot: any) => {
        let list: any = [];

        snapshot.forEach((doc: any) => {
          list.push({ ...doc.data(), id: doc.id });
        });

        setData(list);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [collectionName, query]);

  return { data, loading };
};

export const useGetDocument = (
  collectionName: string,
  documentId: string | undefined
) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!collectionName || !documentId) return;
    setLoading(true);
    onSnapshot(
      doc(db, collectionName, documentId),
      (snapshot) => {
        if (!snapshot.exists()) {
          setData(undefined);
        } else {
          setData({ ...(snapshot.data() as any), id: snapshot.id });
        }
      },
      (error) => {
        toast.error(error.code);
      }
    );
    setLoading(false);
  }, [collectionName, documentId]);

  return { data, loading };
};

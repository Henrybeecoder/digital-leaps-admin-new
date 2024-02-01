import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './fire';

export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);

  const uploadTask = await uploadBytes(storageRef, file);

  return await getDownloadURL(uploadTask.ref);
};
